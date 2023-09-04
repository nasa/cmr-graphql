import os
import traceback
import json
import shutil
from tempfile import mkdtemp

from varinfo import VarInfoFromNetCDF4
from varinfo.cmr_search import get_granules, get_granule_link, download_granule
from varinfo.umm_var import export_all_umm_var_to_json, get_all_umm_var


def default(event, context):
  # Get authorization token from header
  headers = event['headers']
  if 'authorization' in headers:
    token = headers['authorization'] 

  # Get collectionConceptId from the query parameters
  query_string_parameters = event['queryStringParameters']
  if query_string_parameters != None and 'collection_concept_id' in query_string_parameters:
    collection_concept_id = query_string_parameters['collection_concept_id']

  # Setup CMR search url from cmrRootUrl
  cmr_url = os.environ['cmrRootUrl']+'/search/'

  temp_dir = None

  try:
    # Retrieve a list of 10 granules for the collection
    granules = get_granules(collection_concept_id, cmr_env=cmr_url, token=token)

    # Get the URL for the first granule (NetCDF-4 file):
    granule_link = get_granule_link(granules)

    # Make a temporary directory (this may cause permission issues?):
    temp_dir = mkdtemp()

    # Download file to lambda runtime environment
    local_granule = download_granule(granule_link, token, out_directory=temp_dir)

    # Parse the granule with VarInfo:
    var_info = VarInfoFromNetCDF4(local_granule)

    # Generate all the UMM-Var records:
    all_variables = get_all_umm_var(var_info)

    # Delete temporary directory and files
    shutil.rmtree(temp_dir)
  except:
    # Delete temporary directory and files if created
    if temp_dir is not None:
      shutil.rmtree(temp_dir)

    # Print error message and stacktrace
    print('Error executing earthdata-varinfo lambda')
    tb = traceback.format_exc()
    print(tb)
    return {
      'statusCode': 400,
      'headers': {'Content-Type': 'application/json'},
      'body': json.dumps({'Error': 'Error executing earthdata-varinfo lambda',
                          'StackTrace': tb})
  }

  # Return a successful response
  return {
      'statusCode': 200,
      'headers': {'Content-Type': 'application/json'},
      'body': json.dumps(list(all_variables.values()), indent=4)
  }

if __name__ == "__main__":
  print(default('', ''))