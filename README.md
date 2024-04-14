# [CMR-GraphQL](https://graphql.earthdata.nasa.gov/api)

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
![Build Status](https://github.com/nasa/cmr-graphql/workflows/CI/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/nasa/cmr-graphql/branch/main/graph/badge.svg?token=VZiaLjxD2m)](https://codecov.io/gh/nasa/cmr-graphql)

## About

CMR-GraphQL is an API developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov) to search against [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) concept metadata using [GraphQL](https://graphql.org/).

## License

> Copyright © 2007-2023 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Application Installation

Before running the application you'll want to ensure that all necessary packages are installed by running:

   npm install

You will also need Python3.9+ (Ideally installed in a virtual environment) to query the collection generateVariableDrafts field. Run the following to ensure proper operation of this query.

    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

CMR-GraphQL uses a few environment variables for configuring runtime options:

|Variable Name|Default|Description|
|-|:-:|-|
|CMR_ROOT_URL||URL to ping when retrieving metadata from CMR e.g. https://cmr.earthdata.nasa.gov|
|MMT_ROOT_URL||URL to ping when retrieving metadata from MMT e.g. https://mmt.earthdata.nasa.gov|
|DRAFT_MMT_ROOT_URL||URL to ping when retrieving draft metadata from Draft MMT e.g. https://draftmmt.earthdata.nasa.gov|
|LAMBDA_TIMEOUT|30|Number of seconds to set the Lambda timeout to.|
|EDL_KEY_ID, EDL_JWK, EDL_CLIENT_ID|For facilitating EDL connection -- obtain these from a dev|

### Serverless Framework

The local development environment for the static assets can be started by executing the command below in the project root directory:

    serverless offline

This will run the application at [http://localhost:3003/dev/api](http://localhost:3003/dev/api)


#### Optional Headers

CMR-GraphQL supports a few optional headers that can be used for various features and debugging purposes.

##### Authentication

CMR-GraphQL accepts [Earthdata Login (EDL)](https://urs.earthdata.nasa.gov/) tokens via the `Authorization` header. If provided, this token will be provided to any CMR call made as part of the query. CMR-GraphQL will return errors if the token is invalid or expired in which case the client will need to handle the response accordingly.

##### Identification

In order for us to best provide debugging, statistics, and to inform us of future feature work CMR-GraphQL accepts the `Client-Id` header that allows all clients to identifiy themselves. If provided, this value is passed to any CMR call made as part of the query and is used to determine usage patterns, helps debug issues by filtering down logs, and also will help determine priority of feature requests.

##### Request Tracking

Logging is key to debugging, and to ensure that we can provide the best support to users' when issues may arise, CMR-GraphQL supports the `X-Request-Id` header. This header will be passed to any CMR call made as part of the query which will be prepended to any CMR logs that are generated as a result of a query. This value is also used in CMR-GraphQL logs so that we can associate our logs, CMR logs, and any logs you may have if debugging becomes necessary. We recommend setting this value with all requests in the event it is needed, it cannot be added retroactively.

#### Queries

When querying for multiple items there are three high level parameters that can be provided, `count`, `cursor`, `facets` and `items`.

##### Count

`count` will hold the value returned from the CMR header `CMR-Hits` for the respective concept type providing the total number of results (ignoring the current page size).

##### Cursor

`cursor` tells CMR-GraphQL that you'd like to fetch the search after identifier out of the response header with the intent of harvesting data (or fetching multiple pages of results). To take advantage of the cursor you can then include it in subsequent queries until no data is returned.

###### First Request:

```gql
{
  concept {
    count
    cursor
    items {
      conceptId
    }
  }
}
```

Which will return something similar to the following:

```json
{
  "data": {
    "concept": {
      "count": 2483,
      "cursor": "eyJqc29uIjoiLTQ2OTA0MDY3NyJ9=",
      "items": [
        {
          "conceptId": "C1000000001-EXAMPLE"
        },
        ...
    }
  }
}
```

###### Subsequent Requests

```gql
{
  concept(cursor: "eyJqc29uIjoiLTQ2OTA0MDY3NyJ9=") {
    count
    cursor
    items {
      conceptId
    }
  }
}
```

A couple of things to keep in mind when using a cursor

1. Subsequent queries **require** that the same search parameters are sent to ensure that the same query is performed.
2. Subsequent queries must be made **sequentially** (as of August 21, 2020) as the version of Elastic Search CMR uses does not support parallel queries using the same cursor value.

When all results have been returned, the response will be an empty array and the `cursor` will return a value of `null`.

##### Facets

`facets` will return the data provided by CMR determined by which facets you requested in your query. In order for this data to be provided by CMR you will need to include the `includeFacets` parameter in your query. For more information regarding facets refer to the [CMR documentation](https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html#facets). See below for a basic example:

```gql
{
  collections(
    includeFacets:"v2"
  ) {
    facets
    items {
      conceptId
    }
  }
}
```

##### Items

`items` is where you will provide the columns you'd like returned from CMR.

```gql
{
  concept {
    count
    items {
      conceptId
    }
  }
}
```

If you're querying single objects `count` is not available and therefore `items` isn't necessary -- you can simply list the columns you'd like returned from CMR as a direct child of your query.

```gql
{
  concept {
    conceptId
  }
}
```

Note that the response you get will match the structure of your query, meaning that in the event you've requested data from a list query you'll receive the results in an `items` array whereas with a single query request you will not.


## Usage

Currently, this API supports the following functionality within NASA's Earthdata Ecosystem.

### Concepts (Objects)
- [Collections](#collections)
- [Granules](#granules)
- [Grids](#grids)
- [Order Options](#order-options)
- [Services](#services)
- [Subscriptions](#subscriptions)
- [Tools](#tools)
- [Variables](#variables)

### Drafts of concepts
- [Drafts](#drafts)

### Associations between the supported concepts
> Granules are not supported in this implementation, associations cannot be made between granules and any other concept

- [Associations](#associations)

### Access controls and permissions pertaining to the supported concepts
- [ACLs](#collections)
- [Permissions](#collections)

#### Collections

A subset of supported arguments will automatically be sent to immediately adjacent granule queries, for a list of those arguments see [Passthrough Arguments](#passthrough-arguments).

For all supported arguments and columns, see [the schema](src/types/collection.graphql).

##### Example Queries

###### Query for a single collection

```gql
{
  collection(conceptId:"C1000000001-EXAMPLE") {
    title
    granules {
      count
      items {
        conceptId
        title
      }
    }
    services {
      count
      items {
        conceptId
        type
      }
    }
    tools {
      count
      items {
        conceptId
        supportedBrowsers
      }
    }
    variables {
      count
      items {
        conceptId
        name
      }
    }
  }
}
```

###### Query for multiple collections

```gql
{
  collections(
    conceptId:["C1000000001-EXAMPLE", "C1000000002-EXAMPLE"]
  ) {
    count
    items {
      title
      granules {
        count
        title
      }
      services {
        count
        items {
          conceptId
          type
        }
      }
      tools {
        count
        items {
          conceptId
          supportedBrowsers
        }
      }
      variables {
        count
        items {
          conceptId
          name
        }
      }
    }
  }
}
```

#### Granules

For performance reasons, CMR requires that a collection be provided in order to query granules. While CMR supports multiple aliases for the collection CMR-GraphQL requires that it be called `collectionConceptId`; if this is not provided CMR will return an error. We don't enforce this in the schema because you can also use `conceptId` if you're looking for specific granules and schemas don't offer a means of offering conditional validations.

##### Passthrough Arguments

A subset of the supported arguments for [Collections](#collections) will be passed through to the granule query by default. Those arguments are as follows:

- boundingBox
- circle
- point
- polygon
- temporal

For all supported arguments and columns, see [the schema](src/types/granule.graphql).

##### Granule Queries

###### Query for a single granule

```gql
{
  granule(conceptId:"G1000000001-EXAMPLE") {
    conceptId
    title
  }
}
```

###### Query for multiple granules

```gql
{
  granules(collectionConceptId:"G1000000001-EXAMPLE") {
    items {
      conceptId
      title
    }
  }
}
```

#### Services

For all supported arguments and columns, see [the schema](src/types/service.graphql).

##### Service Queries

###### Query for a single service

```gql
{
  service(conceptId:"S1000000001-EXAMPLE") {
    conceptId
    type
  }
}
```

###### Query for multiple services

```gql
{
  services {
    count
    items {
      conceptId
      type
      description
    }
  }
}
```

#### Subscriptions

For all supported arguments and columns, see [the schema](src/types/subscription.graphql).

##### Subscription Queries

###### Query for a single subscription

```gql
{
  subscription(conceptId:"SUB1000000001-EXAMPLE") {
    conceptId
    nativeId
    query
  }
}
```

*To also retrieve details pertaining to the associated collection:*

```gql
{
  subscription(conceptId:"SUB1000000001-EXAMPLE") {
    conceptId
    nativeId
    query
    collection {
      title
    }
  }
}
```

###### Query for multiple subscriptions

```gql
{
  subscriptions {
    count
    items {
      conceptId
      query
    }
  }
}
```

*To also retrieve details pertaining to the associated collections:*

```gql
{
  subscriptions {
    count
    items {
      conceptId
      query
      collection {
        title
      }
    }
  }
}
```

##### Mutations

##### Creating a Subscription

If no `nativeId` is provided, CMR-GraphQL will generate a GUID and supply it.

```gql
mutation {
  createSubscription(
    collectionConceptId: "C1000000001-EXAMPLE"
    name: "Example Subscription"
    query: "polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78"
    subscriberId: "username"
  ) {
    conceptId
    revisionId
  }
}
```

To set the `nativeId` to a desired value, simply provide it as an argument and it will be used.

```gql
mutation {
  createSubscription(
    collectionConceptId: "C1000000001-EXAMPLE"
    name: "Example Subscription"
    nativeId: "SUPPLIED-NATIVE-ID"
    query: "polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78"
    subscriberId: "username"
  ) {
    conceptId
    revisionId
  }
}
```

##### Updating a Subscription

CMR defines a record as unique based on the `nativeId`, in order to update a subscription supply a `nativeId` that belongs an existing record.

```gql
mutation {
  updateSubscription(
    collectionConceptId: "C1000000001-EXAMPLE"
    name: "Example Subscription"
    nativeId: "EXISTING-NATIVE-ID"
    query: "polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78"
    subscriberId: "username"
  ) {
    conceptId
    revisionId
  }
}
```

**NOTES**:

- Due to the way in which CMR works, `createSubscription` and `updateSubscription` will operate identically when supplying an existing `nativeId` however, this may not always be the case so we encourage you to use the explicit `updateSubscription` mutation noted below.

##### Deleting a Subscription

CMR defines a record as unique based on the `nativeId`, in order to delete a subscription supply a `nativeId` that belongs an existing record.

```gql
mutation {
  deleteSubscription(
    conceptId: "SUB1000000001-EXAMPLE"
    nativeId: "EXISTING-NATIVE-ID"
  ) {
    conceptId
    revisionId
  }
}
```

#### Tools

For all supported arguments and columns, see [the schema](src/types/tool.graphql).

##### Tool Queries

###### Query for a single tool

```gql
{
  tool(conceptId:"T1000000001-EXAMPLE") {
    conceptId
    scienceKeywords
    supportedBrowsers
  }
}
```

###### Query for multiple tools

```gql
{
  tools {
    count
    items {
      conceptId
      toolKeywords
      supportedBrowsers
    }
  }
}
```

###### Deleting a Tool

```gql
mutation DeleteTool(
  $providerId: String!
  $nativeId: String!
) {
  deleteTool(
    providerId: $providerId
    nativeId: $nativeId
  ) {
    conceptId
    revisionId
  }
}
```

Variables:

```json
{
  "providerId": "EXAMPLE",
  "nativeId": "tool-1"
}
```

#### Variables

For all supported arguments and columns, see [the schema](src/types/variable.graphql).

##### Grid Queries

###### Query for a single grid

```gql
{
  variable(conceptId:"V1000000001-EXAMPLE") {
    conceptId
    scienceKeywords
    variableType
  }
}
```

###### Query for multiple variables

```gql
{
  variables {
    count
    items {
      conceptId
      scienceKeywords
      variableType
    }
  }
}
```

#### Grids

For all supported arguments and columns, see [the schema](src/types/grid.graphql).

##### Example Queries

###### Query for a singe grid

```gql
{
  grid(conceptId:"GRD1000000001-EXAMPLE") {
    conceptId
    title
  }
}
```

###### Query for multiple grids

```gql
{
  grids {
    items {
      conceptId
      name
      longName
      description
    }
  }
}
```

#### Order Options

For all supported arguments and columns, see [the schema](src/types/orderOption.graphql).

##### Order Option Queries

###### Query for a single order option

```gql
{
  query ($params: OrderOptionInput) {
    orderOption(params: $params) {
      associationDetails
      conceptId
      id
      name
      nativeId
      description
      form
    }
  }
}
```

Variables:

```json
{
  "params": {
    "conceptId": "OO1000000001-EXAMPLE"
  }
}
```

###### Query for multiple order options

```gql
{
  orderOptions {
    count
    items {
      conceptId
      name
      nativeId
      id
      description
      scope
      form
      sortKey
    }
  }
}
```

##### Order Option Mutations

###### Creating an order option

Query:

```gql
mutation CreateOrderOption($description: String!, $name: String!, $providerId:
String!, $form: String!, $nativeId: String) {
  createOrderOption(description: $description, name: $name, providerId: $providerId, form: $form, nativeId: $nativeId) {
    conceptId
    revisionId
  }
}
```

Variables:

```json
{
  "description": "This is a description",
  "form": "This is the form",
  "name": "This is another new name",
  "nativeId": "test-native-id-2",
  "providerId": "MMT_1",
}
```

###### Updating an order option

Query:

```gql
mutation UpdateOrderOption($providerId: String!, $description: String!, $form: String!, $nativeId: String!, $name: String!) {
  updateOrderOption(providerId: $providerId, description: $description, form: $form, nativeId: $nativeId, name: $name) {
    conceptId
    revisionId
  }
}
```

Variables:

```json
{
  "description": "This is a new description",
  "form": "something new",
  "name": "this is a name",
  "nativeId": "collection1",
  "providerId": "MMT_1",
}
```

###### Deleting an order option

Query:

```gql
mutation DeleteOrderOption($nativeId: String!, $providerId: String!) {
  deleteOrderOption(nativeId: $nativeId, providerId: $providerId) {
    conceptId
    revisionId
  }
}
```

Variables:

```json
{
  "nativeId": "b4876280-c7ff-41ab-b08f-af91369fe464",
  "providerId": "MMT_1"
}
```

#### Data Quality Summaries

For all supported arguments and columns, see [the schema](src/types/dataQualitySummary.graphql).

##### Data Quality Summary Queries

###### Query for a single data quality summary

```gql
{
  query ($params: DataQualitySummaryInput) {
    dataQualitySummary(params: $params) {
      associationDetails
      conceptId
      id
      name
      nativeId
      summary
    }
  }
}
```

Variables:

```json
{
  "params": {
    "conceptId": "DQS1000000001-EXAMPLE"
  }
}
```

###### Query for multiple data quality summaries

```gql
{
  dataQualitySummaries {
    items {
      conceptId
      associationDetails
      name
      summary
      id
    }
  }
}
```

#### Related Collections

For all supported arguments and columns, see [the schema](src/types/collection.graphql).

CMR-GraphQL queries CMR's GraphDB in order to find related collections on supported fields. These related collections can be returned as part of the Collection type response.

`relatedCollections` will return related collections, with those collections that share the most relationships first

We use [GraphQL interfaces](https://graphql.org/learn/schema/#interfaces) in order to return the different relationship types as siblings in the return object.

##### Example Queries

```gql
{
  conceptId
  relatedCollections (
    limit: 1
  ) {
    count
    items {
      id
      title
      doi
      relationships {
        relationshipType
        ... on GraphDbProject {
          name
        }
        ... on GraphDbPlatformInstrument {
          platform
          instrument
        }
        ... on GraphDbRelatedUrl {
          url
          description
          type
          subtype
        }
      }
    }
  }
}
```

##### Example Response

```json
{
  "conceptId": "C1000000001-EXAMPLE",
  "relatedCollections": {
    "count": 18,
    "items": [
      {
        "id": "C2000000001-EXAMPLE",
        "title": "Infrared Global Geostationary Composite Demo 4",
        "doi": "10.5067/GHRC/AMSU-A/DATA303",
        "relationships": [
          {
            "relationshipType": "platformInstrument",
            "platform": "MTSAT-1R",
            "instrument": "VISSR"
          },
          {
            "relationshipType": "relatedUrl",
            "url": "https://doi.org/10.5067/9LNYIYOBNBR5",
            "description": "Another Related URL for Demo",
            "type": "VIEW RELATED INFORMATION",
            "subtype": "DATA RECIPE"
          },
          {
            "relationshipType": "project",
            "name": "Project2"
          }
        ]
      }
    ]
  }
}
```

#### Generate Collection Variable Drafts

For all supported arguments and columns, see [the schema](src/types/collection.graphql).

CMR-GraphQL queries an earthdata-varinfo lambda in order to generate collection variable drafts. These generated variable drafts can be returned as part of the Collection type response.

`generateVariableDrafts` will return collection generated variable drafts, using the earthdata-varinfo project(https://github.com/nasa/earthdata-varinfo)

##### Collection Variable Draft Queries

```gql
{
  query Collection($params: CollectionInput) {
    collection(params: $params) {
      conceptId
      generateVariableDrafts {
        count
        items {
          dataType
          definition
          dimensions
          longName
          name
          standardName
          units
          metadataSpecification
        }
      }
    }
  }
}
```

Variables:

```json
{
  "params": {
    "conceptId": "C1000000001-EXAMPLE"
  }
}
```

##### Example Response

```json
  {
  "data": {
    "collection": {
      "conceptId": "C1000000001-EXAMPLE",
      "generateVariableDrafts": {
        "count": 16,
        "items": [
          {
            "dataType": "int32",
            "definition": "Grid/time",
            "dimensions": [
              {
                "Name": "Grid/time",
                "Size": 1,
                "Type": "TIME_DIMENSION"
              }
            ],
            "longName": "Grid/time",
            "name": "Grid/time",
            "standardName": "time",
            "units": "seconds since 1970-01-01 00:00:00 UTC",
            "metadataSpecification": {
              "URL": "https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2",
              "Name": "UMM-Var",
              "Version": "1.8.2"
            }
          }
        ]
      }
    }
  }
}
```

#### Publish Generated Collection Variable Drafts

For all supported arguments and columns, see [the schema](src/types/variable.graphql).

CMR-GraphQL queries an earthdata-varinfo lambda in order to generate and publish collection variable drafts. The resulting variables can be returned as part of the Variable type response.

`publishVariableDrafts` will return collection generated variables, using the earthdata-varinfo project(https://github.com/nasa/earthdata-varinfo)

##### Generate Collection Variable Drafts Mutation

```gql
mutation PublishGeneratedVariables($conceptId: String!) {
  publishGeneratedVariables(conceptId: $conceptId) {
    count
    items {
      conceptId
      dataType
      definition
      dimensions
      longName
      name
      standardName
      units
      metadataSpecification
    }
  }
}
```

Variables:

```json
{
  "conceptId": "C1000000001-EXAMPLE"
}
```

##### Example Response

```json
  {
  "data": {
    "publishGeneratedVariables": {
      "count": 1,
      "items": [
        {
          "conceptId": "V1000000001-EXAMPLE",
          "dataType": "int32",
          "definition": "Grid/time",
          "dimensions": [
            {
              "Name": "Grid/time",
              "Size": 1,
              "Type": "TIME_DIMENSION"
            }
          ],
          "longName": "Grid/time",
          "name": "Grid/time",
          "standardName": "time",
          "units": "seconds since 1970-01-01 00:00:00 UTC",
          "metadataSpecification": {
            "URL": "https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2",
            "Name": "UMM-Var",
            "Version": "1.8.2"
          }
        }
      ]
    }
  }
}
```

#### Drafts

For all supported arguments and columns, see [the schema](src/types/draft.graphql).

The Draft type utilizes the `PreviewMetadata` union type, which means you can return any of the types supported by the union in the `previewMetadata` return field. You need to ensure that your `conceptType` parameter matches the `previewMetadata` type. In the examples below notice the `conceptType` parameter is `Tool`, and the syntax in the request of `... on Tool {`.

##### Example Queries

###### Query for a single draft

```gql
query Draft($params: DraftInput) {
  draft(params: $params) {
    conceptId
    conceptType
    deleted
    name
    nativeId
    providerId
    revisionDate
    revisionId
    ummMetadata
    previewMetadata {
      ... on Tool {
        name
        longName
        collections {
          count
        }
      }
    }
  }
}
```

Variables:

```json
{
  "params": {
    "conceptId": "TD1000000001-EXAMPLE",
    "conceptType": "Tool"
  }
}
```

###### Query for multiple drafts

```gql
query Drafts($params: DraftsInput) {
  drafts(params: $params) {
    count
    items {
      conceptId
      conceptType
      deleted
      name
      nativeId
      providerId
      revisionDate
      revisionId
      ummMetadata
      previewMetadata {
        ... on Tool {
          name
          longName
          collections {
            count
          }
        }
      }
    }
  }
}
```

Variables:

```json
{
  "params": {
    "conceptType": "Tool"
  }
}
```

###### Ingesting a draft

```gql
mutation IngestDraft(
  $conceptType: DraftConceptType!
  $metadata: JSON!
  $nativeId: String!
  $providerId: String!
  $ummVersion: String!
) {
  ingestDraft(
    conceptType: $conceptType
    metadata: $metadata
    nativeId: $nativeId
    providerId: $providerId
    ummVersion: $ummVersion
  ) {
    conceptId
    revisionId
    warnings
    existingErrors
  }
}
```

Variables:

```json
{
  "conceptType": "Tool",
  "metadata": {
    "Name": "Test Tool",
    "MetadataSpecification": {
      "URL": "https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0",
      "Name": "UMM-T",
      "Version": "1.2.0"
    }
  },
  "nativeId": "sampleNativeId",
  "providerId": "EXAMPLE",
  "ummVersion": "1.0.0"
}
```

###### Deleting a draft

```gql
mutation DeleteDraft(
  $conceptType: DraftConceptType!
  $nativeId: String!
  $providerId: String!
) {
  deleteDraft(
    conceptType: $conceptType
    nativeId: $nativeId
    providerId: $providerId
  ) {
    conceptId
    revisionId
    warnings
    existingErrors
  }
}
```

Variables:

```json
{
  "conceptType": "Tool",
  "nativeId": "tool-3",
  "providerId": "EXAMPLE"
}
```

###### Publishing a draft

```gql
mutation PublishDraft(
  $draftConceptId: String!
  $nativeId: String!
  $ummVersion: String!
) {
  publishDraft(
    draftConceptId: $draftConceptId
    nativeId: $nativeId
    ummVersion: $ummVersion
  ) {
    conceptId
    revisionId
    warnings
    existingErrors
  }
}
```

Variables:

```json
{
  "draftConceptId": "TD1000000001-EXAMPLE",
  "nativeId": "tool-1",
  "ummVersion": "1.2.0"
}
```

#### Associations
For all supported arguments and columns, see [the schema](src/types/association.graphql).

<<<<<<< HEAD
The association supports associating a Tool, Variable, or Service record to a collection.

##### Association Query

##### Associating a Tool to a Collection

```gql
Mutation CreateAssociation(
  $conceptId: String!
  $collectionConceptIds: [JSON]!
  $conceptType: ConceptType!
){
  createAssociation(
    conceptId: $conceptId
    collectionConceptIds: $collectionConceptIds
    conceptType: $conceptType
    ) {
    associatedItem
    toolAssociation
  }
}
```
=======
Associations are supported between any of the following concepts, and can be made to any/from any of the concepts
- Tool
- Variable
- Service
- Collections
- Order Options 

##### Creating an Association

###### To A Single Other Concept

    mutation CreateAssociation(
      $conceptId: String!
      $associatedConceptId: String
     ) {
      createAssociation(
        conceptId: $conceptId,
        associatedConceptId: $associatedConceptId
      ) {
        associatedConceptId
        conceptId
        revisionId
      }
    }
    
variables:
>>>>>>> 49b11bd (GQL-38: Updates the Readme)

Variables:

```json
{
  "conceptId": "T1000000001-EXAMPLE",
  "conceptType": "Tool",
  "collectionConceptIds": [
    {
<<<<<<< HEAD
      "conceptId": "C1000000001-EXAMPLE"
=======
      "conceptId": "C1000000001-EXAMPLE",
      "associatedConceptId": "TL12000000-EXAMPLE"
>>>>>>> 49b11bd (GQL-38: Updates the Readme)
    }
  ]
}
```

<<<<<<< HEAD
##### Associating a Variable to a Collection

Note for Variable association, nativeId and metadata are required params.

```gql
Mutation CreateAssociation(
  $conceptId: String!
  $collectionConceptIds: [JSON]!
  $conceptType: ConceptType!
  $nativeId: String
  $metadata: JSON
){
  createAssociation(
    conceptId: $conceptId
    collectionConceptIds: $collectionConceptIds
    conceptType: $conceptType
    nativeId: $nativeId
    metadata: $metadata
    ) {
    associatedItem
    variableAssociation
  }
}
```
=======
###### To Multiple Other Concepts

    mutation CreateAssociation(
      $conceptId: String!,
      $associatedConceptIds: [String]
     ) {
      createAssociation(
        associatedConceptIds: $associatedConceptIds
      ) {
        associatedConceptId
        conceptId
        revisionId
      }
    }
    
variables:
>>>>>>> 49b11bd (GQL-38: Updates the Readme)

Variables:

```json
{
  "conceptId": "V1000000001-EXAMPLE",
  "conceptType": "Variable",
  "collectionConceptIds": [
    {
<<<<<<< HEAD
      "conceptId": "C1000000001-EXAMPLE"
=======
      "conceptId": "C1000000001-EXAMPLE",
      "associatedConceptIds": ["TL12000000-EXAMPLE", "TL12000001-EXAMPLE"]
>>>>>>> 49b11bd (GQL-38: Updates the Readme)
    }
  ],
  "nativeId": "Variable native id",
  "metadata": {}
}
```

<<<<<<< HEAD
##### Disassociation a Tool to a Collection (Delete)
=======
###### To One or More Other Concepts With Data

    mutation CreateAssociation(
      $conceptId: String!,
      $associatedConceptData: JSON
     ) {
      createAssociation(
        associatedConceptData: $associatedConceptData
      ) {
        associatedConceptId
        conceptId
        revisionId
      }
    }
    
variables:

    {
      "conceptId": "C1000000001-EXAMPLE",
      "associatedConceptData": [{
        "conceptId": "TL12000000-EXAMPLE",
        "data": {
          "namespace": {
            "data": true
          }
        }
      }, {
        "conceptId": "TL12000001-EXAMPLE",
        "data": {
          "namespace": {
            "data": false
          }
        }
      }]
    }

##### Deleting an Association

###### A Single Association

    mutation DeleteAssociation(
      $conceptId: String!,
      $associatedConceptId: String
    ) {
      deleteAssociation(
        conceptId: $conceptId,
        associatedConceptId: $associatedConceptId
      ) {
        revisionId
        conceptId
        associatedConceptId
      }
    }
    
variables:

    {
      "conceptId": "C1000000001-EXAMPLE",
      "associatedConceptId": "TL12000000-EXAMPLE"
    }

###### Multiple Associations

    mutation DeleteAssociation(
      $conceptId: String!,
      $associatedConceptId: String
    ) {
      deleteAssociation(
        conceptId: $conceptId,
        associatedConceptId: $associatedConceptId
      ) {
        revisionId
        conceptId
        associatedConceptId
      }
    }
>>>>>>> 49b11bd (GQL-38: Updates the Readme)

```
Mutation DeleteAssociation(
  $conceptId: String!
  $collectionConceptIds: [JSON]!
  $conceptType: ConceptType!
){
  deleteAssociation(
    conceptId: $conceptId
    collectionConceptIds: $collectionConceptIds
    conceptType: $conceptType
    ) {
    associatedItem
    toolAssociation
  }
}
```

Variables:

```json
{
  "conceptId": "TL12000000-EXAMPLE",
  "conceptType": "Tool",
  "collectionConceptIds": [
    {
<<<<<<< HEAD
      "conceptId": "C1000000001-EXAMPLE"
=======
      "conceptId": "C1000000001-EXAMPLE",
      "associatedConceptIds": ["TL12000000-EXAMPLE", "TL12000001-EXAMPLE"]
>>>>>>> 49b11bd (GQL-38: Updates the Readme)
    }
  ]
}
```

#### ACLs

For all supported arguments and columns, see [the schema](src/types/acl.graphql).

##### ACL Queries

###### Query for a single ACL

```gql
query Acl($conceptId: String) {
  acl(conceptId: $conceptId) {
    name
    groupPermissions
  }
}
```

Variables:

```json
{
  "conceptId": "ACL1000000001-EXAMPLE"
}
```

##### Example ACL Query Response

```json
{
  "data": {
    "acl": {
      "groupPermissions": [
        {
          "group_id": "ACL1000000001-EXAMPLE",
          "permissions": [
            "read"
          ]
        },
        {
          "group_id": "ACL1000000002-EXAMPLE",
          "permissions": [
            "read"
          ]
        }
      ],
      "providerIdentity": {
        "target": "PROVIDER_CONTEXT",
        "provider_id": "EXAMPLE"
      }
    }
  }
}
```

###### Query for multiple ACLs

```gql
query Acls($params: AclsInput) {
  acls(params: $params) {
    items {
      systemIdentity
      providerIdentity
    }
  }
}
```

Variables:

```json
{
  "params": {
    "permittedUser": "typical",
    "target": "PROVIDER_CONTEXT"
  }
}
```

##### Example ACLs Query Response

```json
{
  "data": {
    "acls": {
      "items": [
        {
          "groupPermissions": [
            {
              "group_id": "ACL1000000001-EXAMPLE",
              "permissions": [
                "read"
              ]
            },
            {
              "group_id": "ACL1000000002-EXAMPLE",
              "permissions": [
                "read"
              ]
            }
          ],
          "providerIdentity": {
            "target": "PROVIDER_CONTEXT",
            "provider_id": "EXAMPLE"
          }
        }
      ]
    }
  }
}
```

##### ACL Mutations

###### Creating an ACL

```gql
mutation CreateAcl(
  $groupPermissions: JSON
    $catalogItemIdentity: JSON
  ) {
  createAcl(
    groupPermissions: $groupPermissions
    catalogItemIdentity: $catalogItemIdentity
  ) {
    revisionId
    conceptId
  }
}
```

###### Updating an ACL

```gql
mutation UpdateAcl(
  $conceptId: String!
    $catalogItemIdentity: JSON
    $groupPermissions: JSON
) {
  updateAcl(
    conceptId: $conceptId
    catalogItemIdentity: $catalogItemIdentity
    groupPermissions: $groupPermissions
  ) {
  revisionId
  conceptId
  }
}
```

Variables:

```json
{
  "conceptId": "ACL1000000001-EXAMPLE",
  "catalogItemIdentity": {
        "name": "ACL Example Renamed",
        "provider_id": "EXAMPLE",
        "granule_applicable": true
    },
    "groupPermissions": [{
        "user_type": "guest",
        "permissions": ["read"]
    }
  ]
}
```

###### Deleting an ACL

```gql
mutation DeleteAcl($conceptId: String!) {
  deleteAcl(conceptId: $conceptId) {
    conceptId
    revisionId
  }
}
```

Variables:

```json
{
  "conceptId": "ACL1000000001-EXAMPLE"
}
```

#### Permissions

###### Searching by Concept ID

```gql
query GetPermissions($params: PermissionsInput) {
  permissions(params: $params) {
    count
    items {
      conceptId
      permissions
    }
  }
}
```

Variables:

```json
{
  "params": {
    "userType": "registered",
    "conceptId": "C1000000001-EXAMPLE"
  }
}
```

###### Searching by System Object

```gql
query GetPermissions($params: PermissionsInput) {
  permissions(params: $params) {
    count
    items {
      systemObject
      permissions
    }
  }
}
```

Variables:

```json
{
  "params": {
    "userType": "registered",
    "systemObject": "USER"
  }
}
```

###### Searching by Target & Provider

```gql
query GetPermissions($params: PermissionsInput) {
  permissions(params: $params) {
    count
    items {
      target
      permissions
    }
  }
}
```

Variables:

```json
{
  "params": {
    "userType": "registered",
    "target": "GROUP",
    "provider": "EXAMPLE",
  }
}
```


#### Local graph database:

Normally running GraphQl with `serverless offline` will utilize the `(cmr.earthdata.nasa.gov/graphdb)` endpoint, to query against related collections and duplicate collections in the graph database. To send queries to a locally running graph database, we can use a docker gremlin-server that exposes an HTTP endpoint. This is launched by running

`docker run -it -p 8182:8182 tinkerpop/gremlin-server conf gremlin-server-rest-modern.yaml`

as well as altering the `gremlinPath` in `(src/utils/cmrGraphDb.js)` to the localhost address the gremlin server is running on.

We may add data to this local graph database with http POST requests to the gremlin-server.
