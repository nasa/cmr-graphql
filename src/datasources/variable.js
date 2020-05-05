import { parseCmrVariables } from '../utils/parseCmrVariable'
import { queryCmrVariables } from '../utils/queryCmrVariables'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrVariables(params, headers)

    return parseCmrVariables(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
