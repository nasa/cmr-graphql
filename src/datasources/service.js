import { parseCmrServices } from '../utils/parseCmrServices'
import { queryCmrServices } from '../utils/queryCmrServices'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrServices(params, headers)

    return parseCmrServices(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
