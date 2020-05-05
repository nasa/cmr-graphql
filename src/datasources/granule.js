import { queryCmrGranules } from '../utils/queryCmrGranules'

import granuleParser from '../parsers/granule'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrGranules(params, headers)

    return granuleParser(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
