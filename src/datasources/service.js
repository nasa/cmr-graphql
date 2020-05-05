import { queryCmrServices } from '../utils/queryCmrServices'

import serviceParser from '../parsers/service'

export default async (params, headers) => {
  try {
    const cmrResponse = await queryCmrServices(params, headers)

    return serviceParser(cmrResponse)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
