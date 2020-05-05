import { parseCmrGranules } from '../utils/parseCmrGranules'
import { queryCmrGranules } from '../utils/queryCmrGranules'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrGranules(params, headers)

    return parseCmrGranules(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
