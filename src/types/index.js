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
import group from './group.graphql'
import groupMember from './groupMember.graphql'
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
import variable from './variable.graphql'
import variableDraft from './variableDraft.graphql'
import visualization from './visualization.graphql'

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
    group,
    groupMember,
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
    variable,
    variableDraft,
    visualization
  ],
  { all: true },
)
