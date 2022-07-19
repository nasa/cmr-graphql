/**
 * Make a request to local Graph Database and return the promise.
 * @param {String} params.query GraphDB query to search with.
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

async function aclControl(collectionId){
  const query = JSON.stringify({
    gremlin: `
    g
    .addE('controls')
    .from(__.V().hasLabel('acl'))
    .to(__.V().has('collection','id','${collectionId}'))
    `
  })
  //__.V().hasLabel('${subTypeLabel}'
  const acControl = await populateLocal(query)
  return acControl
}
// Hardcoded for now at least there is only 1 grp and acl
async function groupAclRights(){
  const query = JSON.stringify({
    gremlin: `
    g
    .addE('belongsTo')
    .from(__.V().hasLabel('group'))
    .to(__.V().hasLabel('acl'))
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
  aclControl('C1214590112-SCIOPS')
  groupAclRights()

}

function addVertexes(){
  //Add the collections with real concept ids
  addCollections('C1214313574-AU_AADC')
  addCollections('C1214590112-SCIOPS')
  addCollections('C2089372282-NOAA_NCEI')
  addCollections('C1000000220-SEDAC')
  //Add the groups
  addGroups('group1')
  //Add the Acls
  addAcls('ACL1200000008-CMR')
  //Add the Sub-Types
  addPlatformInstruments()
  addProjects()
  addrelatedUrls() 

}



// Main:
addVertexes()
//addEdges()
//aclControl('C1214590112-SCIOPS')
//aclControl('C1214313574-AU_AADC')
