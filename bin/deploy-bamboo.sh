#!/bin/bash

# Bail on unset variables, errors and trace execution
set -eux

# Set up Docker image
#####################

cat <<EOF > .dockerignore
**/node_modules
**/cdk.out
EOF

cat <<EOF > Dockerfile
FROM node:22
COPY . /build
WORKDIR /build
RUN apt-get update
RUN apt-get install -y python3 python3-pip python-is-python3
RUN npm ci --omit=dev
RUN bin/build-python.sh
EOF

dockerTag=edsc-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# Convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerRun() {
  docker run \
    -e "AWS_ACCESS_KEY_ID=$bamboo_AWS_ACCESS_KEY_ID" \
    -e "AWS_ACCOUNT=$bamboo_AWS_ACCOUNT" \
    -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
    -e "CLOUDFRONT_BUCKET_NAME=$bamboo_CLOUDFRONT_BUCKET_NAME" \
    -e "CMR_ROOT_URL=$bamboo_CMR_ROOT_URL" \
    -e "DMMT_SSL_CERT=$bamboo_DMMT_SSL_CERT" \
    -e "DOCKER_DEFAULT_PLATFORM=linux/amd64" \
    -e "DRAFT_MMT_ROOT_URL=$bamboo_DRAFT_MMT_ROOT_URL" \
    -e "EDL_CLIENT_ID=$bamboo_EDL_CLIENT_ID" \
    -e "EDL_JWK=$bamboo_EDL_JWK" \
    -e "EDL_KEY_ID=$bamboo_EDL_KEY_ID" \
    -e "EDL_PASSWORD=$bamboo_EDL_PASSWORD" \
    -e "GRAPHDB_HOST=$bamboo_GRAPHDB_HOST" \
    -e "GRAPHDB_PATH=$bamboo_GRAPHDB_PATH" \
    -e "GRAPHDB_PORT=$bamboo_GRAPHDB_PORT" \
    -e "LAMBDA_TIMEOUT=$bamboo_LAMBDA_TIMEOUT" \
    -e "LOG_DESTINATION_ARN=$bamboo_LOG_DESTINATION_ARN" \
    -e "MMT_ROOT_URL=$bamboo_MMT_ROOT_URL" \
    -e "NODE_ENV=production" \
    -e "SITE_BUCKET=$bamboo_SITE_BUCKET" \
    -e "STAGE_NAME=$bamboo_STAGE_NAME" \
    -e "STELLATE_APP_NAME=$bamboo_STELLATE_APP_NAME" \
    -e "STELLATE_KEY=$bamboo_STELLATE_KEY" \
    -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
    -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
    -e "URS_ROOT_URL=$bamboo_URS_ROOT_URL" \
    -e "VPC_ID=$bamboo_VPC_ID" \
    $dockerTag "$@"
}

# Execute cdk commands in Docker
#######################################

# Deploy AWS Infrastructure Resources
echo 'Deploying AWS Infrastructure Resources...'
dockerRun npm run deploy-infrastructure

# Deploy AWS Application Resources
echo 'Deploying AWS Application Resources...'
dockerRun npm run deploy-application

# Deploy static assets
echo 'Deploying static assets to S3...'
dockerRun npm run deploy-static
