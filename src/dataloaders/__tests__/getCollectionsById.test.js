import nock from 'nock'

import { getCollectionsById } from '../getCollectionsById'

describe('getCollectionsById', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('only makes 2 calls for 3 pieces of data', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Hits': 84,
        'CMR-Took': 7,
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'CMR-Search-After': '["abc", 123, 444]'
      })
      .post(/granules\.json/)
      .reply(200, {
        feed: {
          entry: [
            {
              id: 'G100000-EDSC',
              collection_concept_id: 'C100000-EDSC'
            },
            {
              id: 'G100001-EDSC',
              collection_concept_id: 'C100001-EDSC'
            }
          ]
        }
      })

    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Hits': 84,
        'CMR-Took': 7,
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'CMR-Search-After': '["abc", 123, 444]'
      })
      .post(/collections\.json/)
      .reply(200, {
        feed: {
          entry: [
            {
              id: 'C100000-EDSC',
              title: 'Nullam id dolor id nibh ultricies vehicula ut id elit.'
            },
            {
              id: 'C100001-EDSC',
              title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
            }
          ]
        }
      })

    const context = {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': '4a557d1a-d592-48fb-9833-685aecfb2501'
      }
    }

    const parsedInfo = {
      name: 'collection',
      alias: 'collection',
      args: {},
      fieldsByTypeName: {
        Collection: {
          conceptId: {
            name: 'conceptId',
            alias: 'conceptId',
            args: {},
            fieldsByTypeName: {}
          },
          title: {
            name: 'title',
            alias: 'title',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }

    const collections = await getCollectionsById([
      {
        conceptId: 'C100000-EDSC',
        context,
        parsedInfo
      },
      {
        conceptId: 'C100001-EDSC',
        context,
        parsedInfo
      }
    ])

    expect(collections).toEqual([
      {
        conceptId: 'C100000-EDSC',
        title: 'Nullam id dolor id nibh ultricies vehicula ut id elit.'
      },
      {
        conceptId: 'C100001-EDSC',
        title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
      }
    ])
  })

  test('returns the data in the same order as the input', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Hits': 5,
        'CMR-Took': 7,
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'CMR-Search-After': '["abc", 123, 444]'
      })
      .post(/granules\.json/)
      .reply(200, {
        feed: {
          entry: [
            {
              id: 'G100000-EDSC',
              collection_concept_id: 'C100000-EDSC'
            },
            {
              id: 'G100001-EDSC',
              collection_concept_id: 'C100001-EDSC'
            },
            {
              id: 'G100002-EDSC',
              collection_concept_id: 'C100000-EDSC'
            },
            {
              id: 'G100003-EDSC',
              collection_concept_id: 'C100002-EDSC'
            },
            {
              id: 'G100004-EDSC',
              collection_concept_id: 'C100001-EDSC'
            }
          ]
        }
      })

    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Hits': 3,
        'CMR-Took': 7,
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'CMR-Search-After': '["abc", 123, 444]'
      })
      .post(/collections\.json/)
      .reply(200, {
        feed: {
          entry: [
            {
              id: 'C100002-EDSC',
              title: 'Etiam laoreet quam sed arcu.'
            },
            {
              id: 'C100001-EDSC',
              title: 'Praesent fermentum tempor tellus.'
            },
            {
              id: 'C100000-EDSC',
              title: 'In id erat non orci commodo lobortis.'
            }
          ]
        }
      })

    const context = {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': '4a557d1a-d592-48fb-9833-685aecfb2501'
      }
    }

    const parsedInfo = {
      name: 'collection',
      alias: 'collection',
      args: {},
      fieldsByTypeName: {
        Collection: {
          conceptId: {
            name: 'conceptId',
            alias: 'conceptId',
            args: {},
            fieldsByTypeName: {}
          },
          title: {
            name: 'title',
            alias: 'title',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }

    const orderedCollections = await getCollectionsById([
      {
        conceptId: 'C100000-EDSC',
        context,
        parsedInfo
      },
      {
        conceptId: 'C100001-EDSC',
        context,
        parsedInfo
      },
      {
        conceptId: 'C100000-EDSC',
        context,
        parsedInfo
      },
      {
        conceptId: 'C100002-EDSC',
        context,
        parsedInfo
      },
      {
        conceptId: 'C100001-EDSC',
        context,
        parsedInfo
      }
    ])

    expect(orderedCollections).toEqual([
      {
        conceptId: 'C100000-EDSC',
        title: 'In id erat non orci commodo lobortis.'
      },
      {
        conceptId: 'C100001-EDSC',
        title: 'Praesent fermentum tempor tellus.'
      },
      {
        conceptId: 'C100000-EDSC',
        title: 'In id erat non orci commodo lobortis.'
      },
      {
        conceptId: 'C100002-EDSC',
        title: 'Etiam laoreet quam sed arcu.'
      },
      {
        conceptId: 'C100001-EDSC',
        title: 'Praesent fermentum tempor tellus.'
      }
    ])
  })

  test('throws on missing results', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Hits': 1,
        'CMR-Took': 7,
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'CMR-Search-After': '["abc", 123, 444]'
      })
      .post(/granules\.json/)
      .reply(200, {
        feed: {
          entry: [
            {
              id: 'G100000-EDSC',
              collection_concept_id: 'C100000-EDSC'
            }
          ]
        }
      })

    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Hits': 0,
        'CMR-Took': 7,
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'CMR-Search-After': '["abc", 123, 444]'
      })
      .post(/collections\.json/)
      .reply(200, {
        feed: {
          entry: []
        }
      })

    const context = {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': '4a557d1a-d592-48fb-9833-685aecfb2501'
      }
    }

    const parsedInfo = {
      name: 'collection',
      alias: 'collection',
      args: {},
      fieldsByTypeName: {
        Collection: {
          conceptId: {
            name: 'conceptId',
            alias: 'conceptId',
            args: {},
            fieldsByTypeName: {}
          },
          title: {
            name: 'title',
            alias: 'title',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }

    await expect(
      getCollectionsById([
        {
          conceptId: 'C100000-EDSC',
          context,
          parsedInfo
        }
      ])
    ).rejects.toThrow('No collections returned with conceptId [C100000-EDSC]')
  })
})
