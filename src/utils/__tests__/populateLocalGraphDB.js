/**
 * This is a utility function used to create vertexes and edges for local dev
 * relies on using the gremlin server docker image
 * the gremlin docker image should be configued with the rest.modern.yaml to expose an HTTP endpoint
 */
 const axios = require('axios');
 
function populateLocal(query){
  const requestConfiguration = {
    data: query,
    method: 'POST',
    url: 'http://localhost:8182/gremlin'
  }
  // Interceptors require an instance of axios
  const instance = axios.create()
  const { interceptors } = instance
  const {
    request: requestInterceptor,
    response: responseInterceptor
  } = interceptors

  // Intercept the request to inject timing information
  requestInterceptor.use((config) => {
    // eslint-disable-next-line no-param-reassign
    config.headers['request-startTime'] = process.hrtime()

    return config
  })
  responseInterceptor.use((response) => {
    // Determine total time to complete this request
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
    response.headers['request-duration'] = milliseconds
    //console.log(`Request ${requestId} to [graphdb conceptId: ${conceptId}] completed external request in [observed: ${milliseconds} ms]`)
    return response
  })
  return instance.request(requestConfiguration)
}

async function addCollections(conceptId){
  const query = JSON.stringify({
    gremlin: `
    g
    .addV('collection')
    .property('id','${conceptId}')
    .property('title','Collection1Title')
    .property('doi','Collection1Doi')
    .property('shortName','CollcectionShortName')
    `
  })
    const colVertex = await populateLocal(query)
    return colVertex
}

async function addrelatedUrls(){
  const query = JSON.stringify({
    gremlin: `
    g
    .addV('relatedUrl')
    .property('type','someRelatedUrlType')
    .property('subType','urlTitle')
    .property('url','https://someURL')
    .property('description','urldesc')
    `
  })
  const relUrls = await populateLocal(query)
  return relUrls
}

async function addProjects(){
  const query = JSON.stringify({
    gremlin: `
    g
    .addV('project')
    .property('name','projectName')
    `
  })
  const proj = await populateLocal(query)
  return proj
}

async function addPlatformInstruments(){
  const query = JSON.stringify({
    gremlin: `
    g
    .addV('platformInstrument')
    .property('platform','platform-shortName')
    .property('instrument','Instrument')
    `
  })
  const pInst= await populateLocal(query)
  return pInst
}
async function addAcls(concept_id){
  const query = JSON.stringify({
    gremlin: `
    g
    .addV('acl')
    .property('concept_id','${concept_id}')
    .property('revision_id','acl_revision_id')
    .property('catelog_item_name','some_Collections_with_records')
    `
  })
  const acls = await populateLocal(query)
  return acls
}

// TODO Remove later; We should make the Acls lower case acl to comform to set precedent
async function addGroups(group_id){
  const query = JSON.stringify({
    gremlin: `
    g
    .addV('group')
    .property('group_id','${group_id}')
    .property('provider_id','PROV1')
    .property('name','prov1_stuff_')
    .property('member_count','some_Collections_with_records')
    `
  })
  const acls = await populateLocal(query)
  return acls
}

async function linkNodes(edgeLabel,subTypeLabel,collectionId){
  const query = JSON.stringify({
    gremlin: `
    g
    .addE('${edgeLabel}')
    .from(__.V().has('collection','id','${collectionId}'))
    .to(__.V().hasLabel('${subTypeLabel}'))
    `
  })
  //__.V().hasLabel('${subTypeLabel}'
  const lnkNodes = await populateLocal(query)
  return lnkNodes
}

async function aclControl(collectionId,aclId){
  const query = JSON.stringify({
    gremlin: `
    g
    .addE('controls')
    .from(__.V().has('acl','concept_id','${aclId}'))
    .to(__.V().has('collection','id','${collectionId}'))
    `
  })
  //__.V().hasLabel('${subTypeLabel}'
  const acControl = await populateLocal(query)
  return acControl
}
// Hardcoded for now at least there is only 1 grp and acl
async function groupAclRights(groupId,aclId){
  const query = JSON.stringify({
    gremlin: `
    g
    .addE('rightsGivenBy')
    .from(__.V().has('group','group_id','${groupId}'))
    .to(__.V().has('acl','concept_id','${aclId}'))
    `
  })
  //__.V().hasLabel('${subTypeLabel}'
  const grpBelongsTo = await populateLocal(query)
  return grpBelongsTo
}


//This drops all vertexes from the graph in Tinkerpop all edges are removed if the vertex to them is removed
// In effect this empties the entire graphDB
async function dropGraphContents(){
  const query = JSON.stringify({
    gremlin: `
    g
    .V().drop()
    `
  })
  const drpGraph = await populateLocal(query)
  return drpGraph
}

function addEdges(){
  linkNodes('includedIn','project','C1214590112-SCIOPS')
  linkNodes('linkedBy','relatedUrl','C1214590112-SCIOPS')
  linkNodes('acquiredBy','platformInstrument','C1214590112-SCIOPS')
  linkNodes('acquiredBy','platformInstrument','C1214313574-AU_AADC')
  aclControl('C1214590112-SCIOPS','ACL1200000003-CMR')
  groupAclRights('AG1200000005-PROV1','ACL1200000003-CMR')

}

function addVertexes(){
  // Add the collections with real concept ids
  
  addCollections('C1214313574-AU_AADC')
  addCollections('C1214590112-SCIOPS')
  addCollections('C2089372282-NOAA_NCEI')
  addCollections('C1000000220-SEDAC')
  
  // Add the groups
  addGroups('AG1200000005-PROV1')
  addGroups('AG1200000004-PROV1')
  addGroups('AG1200000008-CMR')
  
  // Add the Acls
  addAcls('ACL1200000003-CMR')
  
  // Add the Sub-Types
  addPlatformInstruments()
  addProjects()
  addrelatedUrls()
}

// Main:
//addVertexes()
//addEdges()
// Testable links
//aclControl('C1214313574-AU_AADC','ACL1200000003-CMR')
//aclControl('C1000000220-SEDAC','ACL1200000003-CMR')
//linkNodes('linkedBy','relatedUrl','C1000000220-SEDAC')
//linkNodes('includedIn','project','C2089372282-NOAA_NCEI')
//aclControl('C2089372282-NOAA_NCEI','ACL1200000003-CMR')


//Test with another ACL in loop connect that node to this other acl and to a subtype
//addAcls('ACL1200000004-CMR')
//addCollections('C1214313573-SCIOPS')
//aclControl('C1214313573-SCIOPS','ACL1200000004-CMR')
//aclControl('C1214313574-AU_AADC','ACL1200000004-CMR')
//linkNodes('includedIn','project','C1214313573-SCIOPS')

// A second group connecting to another extra acl that is not in local so not retrivable
//addGroups('AG11111111-PROV1')
//groupAclRights('AG11111111-PROV1','ACL1200000004-CMR')

//aclControl('C1214313574-AU_AADC','ACL1200000003-CMR')

// Assign another seperate group and acl to a recource
//groupAclRights('AG1200000008-CMR','ACL1200000004-CMR')
//aclControl('C1214313574-AU_AADC','ACL1200000004-CMR')
