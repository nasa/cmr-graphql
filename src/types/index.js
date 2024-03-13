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
import service from './service.graphql'
import serviceDraft from './serviceDraft.graphql'
import subscription from './subscription.graphql'
import tagDefinition from './tagDefinition.graphql'
import toolDraft from './toolDraft.graphql'
import tool from './tool.graphql'
import variableDraft from './variableDraft.graphql'
import variable from './variable.graphql'
import orderOption from './orderOption.graphql'

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
    service,
    serviceDraft,
    subscription,
    tagDefinition,
    tool,
    toolDraft,
    variable,
    variableDraft
  ],
  { all: true },
)
