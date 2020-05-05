import { queryCmrCollections } from '../utils/queryCmrCollections'

import collectionParser from '../parsers/collection'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrCollections(params, headers)

    return collectionParser(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
