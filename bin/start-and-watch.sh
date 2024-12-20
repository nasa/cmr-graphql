#!/bin/bash

# This will start the watch script and start the sam local api.
# The watch script watches for code changes and rebuilts the CDK template.
# The sam local api starts the api locally using the CDK template.

# This is done in a shell script because CTRL-C will kill both processes and shut down any running docker containers.
(trap 'kill 0' SIGINT; npm run watch & sam local start-api -t ./cdk/graphql/cdk.out/graphql-dev.template.json --warm-containers LAZY --port 3013 --docker-network host)
