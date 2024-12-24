/**
 * Returns an environment specific configuration object for SQS
 * @return {Object} A configuration object for SQS
 */
export const getLambdaConfig = () => {
  const config = {
    apiVersion: '2012-11-05',
    region: 'us-east-1'
  }

  const { env } = process
  const { AWS_SAM_LOCAL: awsSamLocal } = env

  if (awsSamLocal === 'true') {
    config.endpoint = 'http://localhost:3014'
  }

  return config
}
