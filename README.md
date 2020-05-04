# [GraphQL](https://cmr.earthdata.nasa.gov/graphql)

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

## About
GraphQL is an api developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov) to graphql searches against [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) concept metadata.

## License

> Copyright © 2007-2020 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Application Installation and Usage

Before running the application you'll want to ensure that all necessary packages are installed by running:

    npm install
    
GraphQL uses a few environment variables for configuring runtime options:
Variable Name|Default|Description
|-|-|-
|CMR_ROOT_URL||URL to ping when retrieving metadata e.g. https://cmr.earthdata.nasa.gov
|LAMBDA_TIMEOUT|30|Number of seconds to set the Lambda timeout to.

### Serverless Framework

The local development environment for the static assets can be started by executing the command below in the project root directory:

    serverless offline

This will run the application at [http://localhost:3001/graphql](http://localhost:3001/graphql)
