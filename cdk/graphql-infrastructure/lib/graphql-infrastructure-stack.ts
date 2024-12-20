import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { infrastructure } from '@edsc/cdk-utils';

export interface GraphqlInfrastructureStackProps extends cdk.StackProps {
}

const {
  STAGE_NAME = 'dev',
  VPC_ID = 'local-vpc',
} = process.env;

/**
 * The AWS CloudFormation template for this Serverless application
 */
export class GraphqlInfrastructureStack extends cdk.Stack {
  public readonly graphQlLambdaSecurityGroup;
  /**
   * Role used to execute commands across the application
   */
  public readonly graphQlApplicationRole;

  public constructor(scope: cdk.App, id: string, props: GraphqlInfrastructureStackProps = {}) {
    super(scope, id, props);

    // Resources
    const applicationRole = new iam.CfnRole(this, 'ApplicationRole', {
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
      ],
      permissionsBoundary: [
        'arn:aws:iam::',
        this.account,
        ':policy/NGAPShRoleBoundary',
      ].join(''),
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com',
              ],
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
      policies: [
        {
          policyName: 'LambdaBase',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'lambda:InvokeFunction',
                ],
                Resource: '*',
              },
            ],
          },
        },
      ],
    });

    this.graphQlLambdaSecurityGroup = new infrastructure.LambdaSecurityGroup(this, 'GraphQLLambdaSecurityGroup', {
      appName: 'GraphQL',
      stageName: STAGE_NAME,
      vpcId: VPC_ID
    });

    // Outputs
    this.graphQlApplicationRole = applicationRole.attrArn;
    new cdk.CfnOutput(this, 'CfnOutputGraphQLApplicationRole', {
      key: 'GraphQLApplicationRole',
      description: 'Role used to execute commands across the application',
      exportName: `${STAGE_NAME}-GraphQLApplicationRole`,
      value: this.graphQlApplicationRole!.toString(),
    });
  }
}
