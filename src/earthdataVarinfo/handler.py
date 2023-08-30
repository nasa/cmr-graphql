import os
import json
import shutil
from tempfile import mkdtemp

from varinfo import VarInfoFromNetCDF4
from varinfo.cmr_search import get_granules, get_granule_link, download_granule
from varinfo.umm_var import export_all_umm_var_to_json, get_all_umm_var


def default(event, context):
  print('Calling earthdata-varinfo lambda')
  # print(json.dumps(event, indent=4))
  # Get authorization token from header
  headers = event['headers']
  if 'authorization' in headers:
    token = headers['authorization'] 
    # print('Token in python lambda:'+token)

  # Get collectionConceptId from the query parameters
  queryStringParameters = event['queryStringParameters']
  if queryStringParameters != None and 'collection_concept_id' in queryStringParameters:
    collectionConceptId = queryStringParameters['collection_concept_id']
    # print('collection_concept_id:'+collectionConceptId)

  # Get CMR environment from the cmrRootUrl
  cmr_url = os.environ['cmrRootUrl']
  cmr_env = 'PROD'
  if ".sit." in cmr_url:
    cmr_env = 'SIT'
  if ".uat." in cmr_url:
    cmr_env = 'UAT'

  # Retrieve a list of 10 granules for the collection
  granules = get_granules(collectionConceptId, cmr_env, token=token)

  # Get the URL for the first granule (NetCDF-4 file):
  granule_link = get_granule_link(granules)
  print('Downloading granule from '+granule_link)

  # Make a temporary directory (this may cause permission issues?):
  temp_dir = mkdtemp()

  # Download file to lambda runtime environment
  local_granule = download_granule(granule_link, token, out_directory=temp_dir)
  print('Downloaded!')

  # Parse the granule with VarInfo:
  var_info = VarInfoFromNetCDF4(local_granule)

  # Generate all the UMM-Var records:
  all_variables = get_all_umm_var(var_info)

  # Delete temporary directory and files
  shutil.rmtree(temp_dir)

  # Return a successful response
  return {
      'statusCode': 200,
      'headers': {'Content-Type': 'application/json'},
      'body': json.dumps(list(all_variables.values()), indent=4)
  }

if __name__ == "__main__":
  print(default('', ''))