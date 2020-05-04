import axios from 'axios'

export default async (params, token) => {
  const result = []

  try {
    const {
      id,
      pageSize
    } = params

    const headers = {}
    if (token) headers['Echo-Token'] = token

    const response = await axios.get(`${process.env.cmrRootUrl}/search/granules.json`, {
      params: {
        concept_id: id,
        page_size: pageSize
      },
      headers
    })

    const { data } = response
    const { feed } = data
    const { entry } = feed

    entry.forEach((entry) => {
      // TODO: Pull out and return only supported keys
      result.push(entry)
    })

    return result
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
