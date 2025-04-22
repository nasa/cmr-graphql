# [CMR-GraphQL](https://graphql.earthdata.nasa.gov/api)

![Build Status](https://github.com/nasa/cmr-graphql/workflows/CI/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/nasa/cmr-graphql/branch/main/graph/badge.svg?token=VZiaLjxD2m)](https://codecov.io/gh/nasa/cmr-graphql)

## About

CMR-GraphQL is an API developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov) to search against [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) concept metadata using [GraphQL](https://graphql.org/).

## Usage

For full usage documentation see [the docs](https://graphql.earthdata.nasa.gov)

## License

> Copyright © 2007-2023 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Application Installation

### Prerequisites

- Docker
- aws-sam-cli (`brew install aws-sam-cli`)

### Application

To install Node dependencies:

    npm install

Note: The generateVariableDrafts is currently not working in the development environment. These steps do not work with the CDK changes.

    You will also need Python3.11+ (Ideally installed in a virtual environment) to query the collection generateVariableDrafts field. Run the following to ensure proper operation of this query.

        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt

### Environment Variables

We use [dotenvx](https://github.com/dotenvx/dotenvx) to manage multiple `.env` files for various environments. See `.env.EXAMPLE` for an example config, or ask a team member for the full files.

If you want to run any environment locally you will need to create the following files

- .env.prod
- .env.uat
- .env.sit
- .env.local
  - For running a local copy of CMR

CMR-GraphQL uses a few environment variables for configuring runtime options:

|Variable Name|Default|Description|
|-|:-:|-|
|CMR_ROOT_URL||URL to ping when retrieving metadata from CMR e.g. https://cmr.earthdata.nasa.gov|
|MMT_ROOT_URL||URL to ping when retrieving metadata from MMT e.g. https://mmt.earthdata.nasa.gov|
|DRAFT_MMT_ROOT_URL||URL to ping when retrieving draft metadata from Draft MMT e.g. https://draftmmt.earthdata.nasa.gov|
|EDL_KEY_ID, EDL_JWK, EDL_CLIENT_ID, EDL_PASSWORD||For facilitating EDL connection -- obtain these from a dev|

### Running in developement

To run locally, with Docker running and aws-sam-cli installed, run

    npm run start-prod

This will run the `cdk synth` command on `cdk/graphql` to build the application locally, and start the AWS SAM CLI pointing to that local build. As you make changes the `cdk synth` command will run and update the running local API.

This application will be available at [http://127.0.0.1:3013/api](http://127.0.0.1:3013/api)

#### Local graph database

We use a graph database to query against related collections and duplicate collections. To send queries to a locally running graph database, we can use a docker gremlin-server that exposes an HTTP endpoint. This is launched by running

`docker run -it -p 8182:8182 tinkerpop/gremlin-server conf gremlin-server-rest-modern.yaml`

as well as altering the `gremlinPath` in `(src/utils/cmrGraphDb.js)` to the localhost address the gremlin server is running on.

We may add data to this local graph database with http POST requests to the gremlin-server.
