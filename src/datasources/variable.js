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

    const response = await axios.get(`${process.env.cmrRootUrl}/search/variables.json`, {
      params: {
        concept_id: id,
        page_size: pageSize
      },
      headers
    })

    const { data } = response
    const { items } = data

    items.forEach((item) => {
      // Alias concept_id for consistency in responses
      const { concept_id: id } = item

      // TODO: Pull out and return only supported keys
      result.push({
        id,
        ...item
      })
    })

    return result
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
