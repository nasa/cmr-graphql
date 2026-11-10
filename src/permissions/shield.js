/* eslint-disable max-classes-per-file */
// Disbale eslint rule here because we want to keep the Rule classes together in one file
// Porting logic for classes from the orignal shield package `https://github.com/maticzav/graphql-shield/blob/master/packages/graphql-shield/src/rules.ts`
import { defaultFieldResolver } from 'graphql'
import { mapSchema, MapperKind } from '@graphql-tools/utils'

const normalize = (res) => {
  // Normalize the result of a rule to either true, false, or an Error
  if (res instanceof Error) return res
  if (typeof res === 'string') return new Error(res)

  return res === true
}

// Normalize the result of a rule to either true, false, or an Error
class Rule {
  constructor(permissionFunction) {
    this.permissionFunction = permissionFunction
  }

  async resolve(parent, args, ctx, info) {
    try {
      return normalize(await this.permissionFunction(parent, args, ctx, info))
    } catch (err) {
      return err instanceof Error ? err : new Error(err)
    }
  }
}

class RuleRace {
  constructor(rules) {
    this.rules = rules
  }

  async resolve(parent, args, ctx, info) {
    let lastError = false
    // Disable linter ruleS here order matters a Promise.all would not work as
    // we want to return true as soon as one rule returns true, and we want to return the last error if all rules fail
    // eslint-disable-next-line no-restricted-syntax
    for (const rule of this.rules) {
      // eslint-disable-next-line no-await-in-loop
      const res = await rule.resolve(parent, args, ctx, info)
      if (res === true) return true

      if (res instanceof Error) lastError = res
    }

    return lastError
  }
}

class RuleTrue {
  async resolve() {
    return true
  }
}

export const rule = () => (func) => new Rule(func)

export const race = (...rules) => new RuleRace(rules)

export const allow = new RuleTrue()

/*
Graphql-middleware the previous dependency used on the server, works by wrapping resolvers this function:
spread the original config and override only resolve. The new resolver:

Runs the permission rule (activeRule.resolve(...)).
If it returns true, calls the original resolver (resolve || defaultFieldResolver).
If false, calls fallbackError.
If it’s an Error, returns it so GraphQL surfaces it in the response.
*/

export const shield = (ruleTree, {
  fallbackRule = allow,
  allowExternalErrors = false,
  fallbackError
} = {}) => (schema) => {
  // Validate that every type/field in the rule tree exists in the schema (as shield did at startup)
  Object.entries(ruleTree).forEach(([typeName, fields]) => {
    const type = schema.getType(typeName)
    if (!type) throw new Error(`Permissions: type "${typeName}" not found in schema`)

    Object.keys(fields).forEach((fieldName) => {
      if (!type.getFields()[fieldName]) {
        throw new Error(`Permissions: field "${typeName}.${fieldName}" not found in schema`)
      }
    })
  })

  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const fieldRule = ruleTree[typeName]?.[fieldName]
      const { resolve } = fieldConfig
      // Fields with no custom rule and no custom resolver can't throw, so skip wrapping them
      if (!fieldRule && !resolve) return fieldConfig

      const activeRule = fieldRule || fallbackRule
      const resolver = resolve || defaultFieldResolver

      return {
        ...fieldConfig,
        resolve: async (parent, args, ctx, info) => {
          try {
            const res = await activeRule.resolve(parent, args, ctx, info)

            if (res === true) return await resolver(parent, args, ctx, info)

            // Returned an Error (e.g. forbiddenError), surface it directly
            if (res !== false) return res
          } catch (err) {
            if (allowExternalErrors) return err

            return fallbackError(err, parent, args, ctx, info)
          }

          // Rule denied (res === false). Kept outside the try so errors thrown by
          // fallbackError aren't caught and passed back into fallbackError.
          return fallbackError(null, parent, args, ctx, info)
        }
      }
    }
  })
}
