import { parseCmrCollections } from '../utils/parseCmrCollections'
import { queryCmrCollections } from '../utils/queryCmrCollections'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrCollections(params, headers)

    return parseCmrCollections(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
