import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'

const {
  DOCS_BUCKET = 'mock-docs-bucket',
  LANDING_PAGE_BUCKET = 'mock-landing-pagebucket'
} = process.env

export class GraphqlDocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Deploy the landing page to S3
    const landingPageDestinationBucket = s3.Bucket.fromBucketName(this, 'LandingPageBucket', LANDING_PAGE_BUCKET)
    new s3Deployment.BucketDeployment(this, 'LandingPageWebsite', {
      destinationBucket: landingPageDestinationBucket,
      sources: [
        s3Deployment.Source.asset('../../landing-page')
      ],
      include: ['*'],
      cacheControl: [
        s3Deployment.CacheControl.maxAge(cdk.Duration.days(365))
      ]
    })

    // Deploy the docs to S3
    const docsDestinationBucket = s3.Bucket.fromBucketName(this, 'DocsBucket', DOCS_BUCKET)
    new s3Deployment.BucketDeployment(this, 'DocsWebsite', {
      destinationBucket: docsDestinationBucket,
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
