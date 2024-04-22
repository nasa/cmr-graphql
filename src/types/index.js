import { mergeTypeDefs } from '@graphql-tools/merge'

import acl from './acl.graphql'
import association from './association.graphql'
import collection from './collection.graphql'
import collectionDraft from './collectionDraft.graphql'
import collectionDraftProposal from './collectionDraftProposal.graphql'
import dataQualitySummary from './dataQualitySummary.graphql'
import draft from './draft.graphql'
import granule from './granule.graphql'
import grid from './grid.graphql'
import json from './json.graphql'
import orderOption from './orderOption.graphql'
import permission from './permission.graphql'
import provider from './provider.graphql'
import service from './service.graphql'
import serviceDraft from './serviceDraft.graphql'
import subscription from './subscription.graphql'
import tagDefinition from './tagDefinition.graphql'
import tool from './tool.graphql'
import toolDraft from './toolDraft.graphql'
import userGroup from './userGroup.graphql'
import variable from './variable.graphql'
import variableDraft from './variableDraft.graphql'

export default mergeTypeDefs(
  [
    acl,
    association,
    collection,
    collectionDraft,
    collectionDraftProposal,
    dataQualitySummary,
    draft,
    granule,
    grid,
    json,
    orderOption,
    permission,
    provider,
    service,
    serviceDraft,
    subscription,
    tagDefinition,
    tool,
    toolDraft,
    userGroup,
    variable,
    variableDraft
  ],
  { all: true },
)
