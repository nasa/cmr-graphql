import { mergeTypes } from 'merge-graphql-schemas'

import collection from './collection.graphql'
import granule from './granule.graphql'
import json from './json.graphql'
import service from './service.graphql'
import variable from './variable.graphql'

export default mergeTypes(
  [
    collection,
    granule,
    json,
    service,
    variable
  ],
  { all: true },
)
