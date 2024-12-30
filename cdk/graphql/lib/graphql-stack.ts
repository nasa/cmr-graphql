import * as cdk from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';

import { application } from '@edsc/cdk-utils';

export interface GraphqlStackProps extends cdk.StackProps {
}

// `logGroupSuffix` is used during the initial migration from serverless to CDK to avoid name conflicts
// const logGroupSuffix = '_cdk'
const logGroupSuffix = ''

const {
  CLOUDFRONT_BUCKET_NAME = 'local-bucket',
  LOG_DESTINATION_ARN = 'local-arn',
  NODE_ENV = 'development',
  STAGE_NAME = 'dev',
} = process.env;
const runtime = lambda.Runtime.NODEJS_22_X;
const environment = {
  cmrRootUrl: process.env.CMR_ROOT_URL || 'https://cmr.sit.earthdata.nasa.gov',
  draftMmtRootUrl: process.env.DRAFT_MMT_ROOT_URL || 'https://draftmmt.sit.earthdata.nasa.gov',
  mmtRootUrl: process.env.MMT_ROOT_URL || 'https://mmt.sit.earthdata.nasa.gov',
  ursRootUrl: process.env.URS_ROOT_URL || 'https://sit.urs.earthdata.nasa.gov',
  dmmtSslCert: process.env.DMMT_SSL_CERT!,
  edlClientId: process.env.EDL_CLIENT_ID!,
  edlPassword: process.env.EDL_PASSWORD!,
  edlJwk: process.env.EDL_JWK!,
  edlKeyId: process.env.EDL_KEY_ID!,
  graphdbHost: process.env.GRAPHDB_HOST || 'http://localhost',
  graphdbPath: process.env.GRAPHDB_PATH || 'gremlin',
  graphdbPort: process.env.GRAPHDB_PORT || '8182',
  maxRetries: process.env.MAX_RETRIES || '1',
  retryDelay: process.env.RETRY_DELAY || '1000',
  stellateAppName: process.env.STELLATE_APP_NAME!,
  stellateKey: process.env.STELLATE_KEY!,
  lambdaTimeout: process.env.LAMBDA_TIMEOUT || '30',
  ummCollectionVersion: '1.18.2',
  ummGranuleVersion: '1.6.5',
  ummOrderOptionVersion: '1.0.0',
  ummServiceVersion: '1.5.3',
  ummSubscriptionVersion: '1.1.1',
  ummToolVersion: '1.2.0',
  ummVariableVersion: '1.9.0',
  maximumQueryPathLength: '1500',
  stage: STAGE_NAME
}

// NodeJS bundling options
const bundling = {
  // Only minify in production
  minify: NODE_ENV === 'production',
  loader: {
    '.graphql': 'text',
    '.gql': 'text'
  },
  // TODO exlude aws-sdk?
  externalModules: ['@aws-sdk/*']
}

/**
 * The AWS CloudFormation template for this Serverless application
 */
export class GraphqlStack extends cdk.Stack {
  /**
   * Current Lambda function version
   */
  public readonly earthdataVarinfoLambdaFunctionQualifiedArn;
  /**
   * URL of the service endpoint
   */
  public readonly serviceEndpoint;

  public constructor(scope: cdk.App, id: string, props: GraphqlStackProps = {}) {
    super(scope, id, props);

    const applicationRole = cdk.Fn.importValue(`${STAGE_NAME}-GraphQLApplicationRole`);
    const lambdaSecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'GraphqlLambdaSecurityGroup', cdk.Fn.importValue(`${STAGE_NAME}-GraphQLLambdaSecurityGroup`));

    const vpc = Vpc.fromVpcAttributes(this, 'Vpc', {
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      privateSubnetIds: [
        process.env.SUBNET_ID_A!,
        process.env.SUBNET_ID_B!
      ],
      vpcId: process.env.VPC_ID!
    });

    const apiGateway = new application.ApiGateway(this, 'ApiGateway', {
      apiName: `${STAGE_NAME}-graphql`,
      stageName: STAGE_NAME,
    })
    const {
      apiGatewayDeployment,
      apiGatewayRestApi
    } = apiGateway

    /**
     * GraphQL Lambda resources
     */
    new application.NodeJsFunction(this, 'GraphqlLambda', {
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        path: 'api',
        methods: ['GET', 'POST'],
      },
      bundling,
      entry: '../../src/graphql/handler.js',
      environment,
      functionName: 'graphql',
      logDestinationArn: LOG_DESTINATION_ARN,
      logGroupSuffix,
      memorySize: 512,
      role: iam.Role.fromRoleArn(this, 'GraphqlLambdaRole', applicationRole),
      runtime,
      securityGroups: [lambdaSecurityGroup],
      stageName: STAGE_NAME,
      vpc
    });

    /**
     * EarthdataVarinfo Lambda resources
     */
    const earthdataVarinfoLogGroup = new logs.LogGroup(this, 'EarthdataVarinfoLogGroup', {
      logGroupName: `/aws/lambda/${this.stackName}-earthdataVarinfo${logGroupSuffix}`,
    });

    // In production, we build the lambda with build-python.sh
    let earthdataVarinfoCode = lambda.Code.fromAsset('../../src/earthdataVarinfo');
    if (NODE_ENV === 'development') {
      // In development, build the lambda with the Python bundling image
      earthdataVarinfoCode = lambda.Code.fromAsset('../../src/earthdataVarinfo', {
        bundling: {
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output',
          ],
          image: lambda.Runtime.PYTHON_3_11.bundlingImage,
        }
      });
    }

    const earthdataVarinfoLambdaFunction = new lambda.Function(this, 'EarthdataVarinfoLambdaFunction', {
      code: earthdataVarinfoCode,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN
      },
      environment: {
        cmrRootUrl: environment.cmrRootUrl
      },
      ephemeralStorageSize: cdk.Size.gibibytes(2),
      functionName: `${this.stackName}-earthdataVarinfo${logGroupSuffix}`,
      handler: 'handler.main',
      logGroup: earthdataVarinfoLogGroup,
      memorySize: 512,
      role: iam.Role.fromRoleArn(this, 'EarthdataVarinfoLambdaRole', applicationRole),
      runtime: lambda.Runtime.PYTHON_3_11,
      securityGroups: [lambdaSecurityGroup],
      timeout: cdk.Duration.seconds(30),
      vpc
    });
    earthdataVarinfoLambdaFunction.addAlias('current');

    new logs.CfnSubscriptionFilter(this, 'EarthdataVarinfoSubscriptionFilter', {
      destinationArn: LOG_DESTINATION_ARN,
      filterPattern: '',
      logGroupName: earthdataVarinfoLogGroup.logGroupName
    });

    /**
     * CloudfrontToCloudwatch Lambda resources
     */
    new application.CloudfrontToCloudwatchFunction(this, 'CloudfrontToCloudwatch', {
      cloudfrontBucketName: CLOUDFRONT_BUCKET_NAME,
      logDestinationArn: LOG_DESTINATION_ARN,
      logGroupSuffix,
      runtime,
      s3Sources: ['graphql_apigw'],
      securityGroups: [lambdaSecurityGroup],
      stageName: STAGE_NAME,
      vpc
    });

    /**
     * Outputs
     */
    this.earthdataVarinfoLambdaFunctionQualifiedArn = earthdataVarinfoLambdaFunction.currentVersion!.functionArn;
    new cdk.CfnOutput(this, 'CfnOutputEarthdataVarinfoLambdaFunctionQualifiedArn', {
      key: 'EarthdataVarinfoLambdaFunctionQualifiedArn',
      description: 'Current Lambda function version',
      exportName: `sls-${this.stackName}-EarthdataVarinfoLambdaFunctionQualifiedArn`,
      value: this.earthdataVarinfoLambdaFunctionQualifiedArn!.toString(),
    });
    this.serviceEndpoint = [
      'https://',
      apiGatewayRestApi.ref,
      '.execute-api.',
      this.region,
      '.',
      this.urlSuffix,
      `/${STAGE_NAME}`,
    ].join('');
    new cdk.CfnOutput(this, 'CfnOutputServiceEndpoint', {
      key: 'ServiceEndpoint',
      description: 'URL of the service endpoint',
      exportName: `sls-${this.stackName}-ServiceEndpoint`,
      value: this.serviceEndpoint!.toString(),
    });
  }
}
