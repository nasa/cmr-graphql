import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'

const {
  SITE_BUCKET = 'mock-bucket'
} = process.env

export class GraphqlDocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const destinationBucket = s3.Bucket.fromBucketName(this, 'SiteBucket', SITE_BUCKET)

    new s3Deployment.BucketDeployment(this, 'WebsiteAssets', {
      destinationBucket,
      sources: [
        s3Deployment.Source.asset('../../docs')
      ],
      include: ['*'],
      cacheControl: [
        s3Deployment.CacheControl.maxAge(cdk.Duration.days(365))
      ]
    })
  }
}
