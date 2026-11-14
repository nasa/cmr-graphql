import {
  describe,
  expect,
  test,
  vi
} from 'vitest'
import { execute, parse } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import {
  rule,
  race,
  allow,
  shield
} from '../shield'

// ---------------------------------------------------------------------------
// Fixtures & helpers
// ---------------------------------------------------------------------------

const typeDefs = `
  type Query {
    hello: String
    secret: String
  }
`

const defaultResolvers = {
  Query: {
    hello: () => 'world',
    secret: () => 'classified'
  }
}

const buildSchema = (resolvers = defaultResolvers) => makeExecutableSchema({
  typeDefs,
  resolvers
})

const runQuery = (schema, query) => execute({
  schema,
  document: parse(query),
  contextValue: {}
})

const errorMessages = (result) => (result.errors ?? []).map((error) => error.message)

// Evaluate a rule directly, without going through a schema
const evaluateDirectly = (ruleInstance) => ruleInstance.resolve(null, {}, {}, {})

// `rule()` is a factory that returns a function, so `rule()(fn)` is just "make a rule from fn".
// These helpers hide that double call so tests read as intent.
const createRule = (permissionFunction) => rule()(permissionFunction)
const ruleReturning = (value) => createRule(() => value)
const ruleThrowing = (error) => createRule(() => { throw error })

const passingRule = () => ruleReturning(true)
const denyingRule = () => ruleReturning(false)
const errorRule = (message) => ruleReturning(new Error(message))

// ---------------------------------------------------------------------------
// rule
// ---------------------------------------------------------------------------

describe('rule', () => {
  // Similar to `are3` test each condition for all of the possible return values of a rule function
  test.each([
    ['true', true, true],
    ['false', false, false],
    ['null', null, false],
    ['undefined', undefined, false],
    ['a truthy non-true value', 1, false]
  ])('normalizes %s to %s', async (_label, returned, expected) => {
    const result = await evaluateDirectly(ruleReturning(returned))

    expect(result).toBe(expected)
  })

  test('normalizes a returned string to an Error with that message', async () => {
    const result = await evaluateDirectly(ruleReturning('denied'))

    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('denied')
  })

  test('passes an Error instance through unchanged', async () => {
    const error = new Error('forbidden')

    expect(await evaluateDirectly(ruleReturning(error))).toBe(error)
  })

  test('awaits async permission functions', async () => {
    const asyncPermission = async () => true

    expect(await evaluateDirectly(createRule(asyncPermission))).toBe(true)
  })

  test('returns false when the permission function throws', async () => {
    const failingRule = ruleThrowing(new Error('boom'))

    expect(await evaluateDirectly(failingRule)).toBe(false)
  })

  test('calls the permission function with parent, args, ctx and info', async () => {
    const permissionFunction = vi.fn(() => true)
    const parent = { id: 1 }
    const args = { id: 2 }
    const ctx = { user: 'alice' }
    const info = { fieldName: 'secret' }
    const trackedRule = createRule(permissionFunction)

    await trackedRule.resolve(parent, args, ctx, info)

    expect(permissionFunction).toHaveBeenCalledWith(parent, args, ctx, info)
  })
})

// ---------------------------------------------------------------------------
// race
// ---------------------------------------------------------------------------

describe('race', () => {
  test('returns true when the first rule passes', async () => {
    expect(await evaluateDirectly(race(passingRule(), denyingRule()))).toBe(true)
  })

  test('returns true when a later rule passes after earlier ones deny', async () => {
    expect(await evaluateDirectly(race(denyingRule(), errorRule('nope'), passingRule()))).toBe(true)
  })

  test('returns false when every rule denies', async () => {
    expect(await evaluateDirectly(race(denyingRule(), denyingRule()))).toBe(false)
  })

  test('returns the last error when every rule returns an error', async () => {
    const first = new Error('first')
    const last = new Error('last')

    const result = await evaluateDirectly(race(ruleReturning(first), ruleReturning(last)))

    expect(result).toBe(last)
  })

  test('prefers an earlier error over a later plain denial', async () => {
    const error = new Error('forbidden')

    const result = await evaluateDirectly(race(ruleReturning(error), denyingRule()))

    expect(result).toBe(error)
  })

  test('does not evaluate rules after one has passed', async () => {
    const skippedPermission = vi.fn(() => false)

    await evaluateDirectly(race(passingRule(), createRule(skippedPermission)))

    expect(skippedPermission).not.toHaveBeenCalled()
  })

  test('evaluates rules in order', async () => {
    const calls = []
    const trackingRule = (name) => createRule(() => {
      calls.push(name)

      return false
    })

    await evaluateDirectly(race(trackingRule('a'), trackingRule('b'), trackingRule('c')))

    expect(calls).toEqual(['a', 'b', 'c'])
  })
})

// ---------------------------------------------------------------------------
// allow
// ---------------------------------------------------------------------------

describe('allow', () => {
  test('always resolves true', async () => {
    expect(await allow.resolve()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// shield
// ---------------------------------------------------------------------------

describe('shield', () => {
  describe('rule tree validation', () => {
    test('throws when the rule tree references an unknown type', () => {
      const applyShield = shield({ NoSuchType: { hello: allow } })

      expect(() => applyShield(buildSchema())).toThrow(
        'Permissions: type "NoSuchType" not found in schema'
      )
    })

    test('throws when the rule tree references an unknown field', () => {
      const applyShield = shield({ Query: { missing: allow } })

      expect(() => applyShield(buildSchema())).toThrow(
        'Permissions: field "Query.missing" not found in schema'
      )
    })
  })

  describe('when a rule passes', () => {
    test('runs the original resolver and returns its value', async () => {
      const schema = shield({ Query: { secret: allow } })(buildSchema())

      const result = await runQuery(schema, '{ secret }')

      expect(result.errors).toBeUndefined()
      expect(result.data.secret).toBe('classified')
    })
  })

  describe('when a rule denies', () => {
    test('calls fallbackError with a null error and surfaces what it throws', async () => {
      const fallbackError = vi.fn().mockRejectedValue(new Error('not allowed'))
      const schema = shield({ Query: { secret: denyingRule() } }, { fallbackError })(buildSchema())

      const result = await runQuery(schema, '{ secret }')

      expect(fallbackError).toHaveBeenCalledTimes(1)
      expect(fallbackError.mock.calls[0][0]).toBeNull()
      expect(errorMessages(result)).toEqual(['not allowed'])
    })

    test('does not run the original resolver', async () => {
      const secretResolver = vi.fn(() => 'classified')
      const fallbackError = vi.fn().mockRejectedValue(new Error('not allowed'))
      const schema = shield({ Query: { secret: denyingRule() } }, { fallbackError })(
        buildSchema({ Query: { secret: secretResolver } })
      )

      await runQuery(schema, '{ secret }')

      expect(secretResolver).not.toHaveBeenCalled()
    })

    test('surfaces an Error returned by the rule without calling fallbackError', async () => {
      const fallbackError = vi.fn()
      const schema = shield({ Query: { secret: errorRule('forbidden') } }, { fallbackError })(buildSchema())

      const result = await runQuery(schema, '{ secret }')

      expect(errorMessages(result)).toEqual(['forbidden'])
      expect(fallbackError).not.toHaveBeenCalled()
    })
  })

  describe('when the resolver throws', () => {
    const dbError = new Error('db down')
    const throwingSchema = () => buildSchema({
      Query: {
        secret: () => { throw dbError }
      }
    })

    test('passes the thrown error to fallbackError', async () => {
      const fallbackError = vi.fn(async (error) => { throw new Error(`wrapped: ${error.message}`) })
      const schema = shield({ Query: { secret: allow } }, { fallbackError })(throwingSchema())

      const result = await runQuery(schema, '{ secret }')

      expect(fallbackError).toHaveBeenCalledTimes(1)
      expect(fallbackError.mock.calls[0][0]).toBe(dbError)
      expect(errorMessages(result)).toEqual(['wrapped: db down'])
    })

    test('with allowExternalErrors, returns the error without calling fallbackError', async () => {
      const fallbackError = vi.fn()
      const schema = shield(
        { Query: { secret: allow } },
        {
          allowExternalErrors: true,
          fallbackError
        }
      )(throwingSchema())

      const result = await runQuery(schema, '{ secret }')

      expect(fallbackError).not.toHaveBeenCalled()
      expect(errorMessages(result)).toEqual(['db down'])
    })
  })

  describe('fallbackRule', () => {
    test('applies to fields that have a custom resolver but no rule', async () => {
      const fallbackError = vi.fn().mockRejectedValue(new Error('not allowed'))
      const schema = shield({}, {
        fallbackRule: denyingRule(),
        fallbackError
      })(buildSchema())

      const result = await runQuery(schema, '{ hello }')

      expect(errorMessages(result)).toEqual(['not allowed'])
    })

    test('defaults to allow', async () => {
      const schema = shield({})(buildSchema())

      const result = await runQuery(schema, '{ hello }')

      expect(result.errors).toBeUndefined()
      expect(result.data.hello).toBe('world')
    })
  })

  describe('wrapping', () => {
    test('leaves fields with no rule and no custom resolver untouched', () => {
      const schemaWithoutResolvers = makeExecutableSchema({ typeDefs })

      const schema = shield({})(schemaWithoutResolvers)

      expect(schema.getQueryType().getFields().hello.resolve).toBeUndefined()
    })

    test('wraps fields that have a rule', () => {
      const schemaWithoutResolvers = makeExecutableSchema({ typeDefs })

      const schema = shield({ Query: { hello: allow } })(schemaWithoutResolvers)

      expect(schema.getQueryType().getFields().hello.resolve).toBeTypeOf('function')
    })

    test('does not mutate the original schema', () => {
      const original = buildSchema()
      const originalResolver = original.getQueryType().getFields().secret.resolve

      shield({ Query: { secret: denyingRule() } })(original)

      expect(original.getQueryType().getFields().secret.resolve).toBe(originalResolver)
    })
  })
})
