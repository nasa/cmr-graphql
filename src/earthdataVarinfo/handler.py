"""Module providing access to environment variables"""
import os

# Needed by serverless python requirements because we are setting zip to true
try:
  import unzip_requirements
except ImportError:
  pass

from varinfo.generate_umm_var import generate_collection_umm_var

def main(event, context):
    """Handler that calls the earthdata-varinfo library"""

    # Setup CMR search url from cmrRootUrl
    cmr_url = os.environ['cmrRootUrl'] + '/search/'

    # Pull the concept id and token from the body
    collection_concept_id = event.get('conceptId')

    # Get token
    auth_header = event.get('authHeader')

    if event.get('publish') is None:
        publish = False
    else:
        publish = event.get('publish')

    # These two arguments are required for varinfo, return an error if they are not provided
    if collection_concept_id is None or auth_header is None:
        return {
            'isBase64Encoded': False,
            'statusCode': 500,
            'body': {
                'error': 'Collection Concept ID and Authentication Header must be provided.'
            }
        }

    try:
        # Generate all the UMM-Var records:
        all_variables = generate_collection_umm_var(collection_concept_id,
                                                    auth_header=auth_header,
                                                    cmr_env=cmr_url,
                                                    publish=publish)
    except Exception as error:
        return {
            'isBase64Encoded': False,
            'statusCode': 500,
            'body': {
                'error': str(error)
            }
        }

    if publish == True:
       all_variables = [{'conceptId': item} for item in all_variables]

    # Return a successful response
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'body': list(all_variables)
    }
