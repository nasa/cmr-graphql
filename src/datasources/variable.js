import { queryCmrVariables } from '../utils/queryCmrVariables'

import variableParser from '../parsers/variable'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrVariables(params, headers)

    return variableParser(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
