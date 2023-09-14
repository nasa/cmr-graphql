import os
import json

from unittest import TestCase, mock
from unittest.mock import patch
from handler import main

@mock.patch.dict(os.environ, {"cmrRootUrl": "https://cmr-example"})
class HandlerTest(TestCase):
    ''' A class for testing main function of handler.py
    '''
    def test_missing_token(self):
        ''' Test when main is called with a missing token in the event paramter
        '''
        response = main({'conceptId': 'C1234-TEST'}, "")
        expected_response = {'body': {'error': 'Collection Concept ID and Token must be provided.'},
                             'isBase64Encoded': False,
                             'statusCode': 500}
        self.assertEqual(response, expected_response)

    def test_missing_concept_id(self):
        ''' Test when main is called with a missing conceptId in the event paramter
        '''
        response = main({'token': 'faketoken'}, "")
        expected_response = {'body': {'error': 'Collection Concept ID and Token must be provided.'},
                             'isBase64Encoded': False,
                             'statusCode': 500}
        self.assertEqual(response, expected_response)

    @patch('handler.get_granules')
    @patch('handler.get_granule_link')
    @patch('handler.download_granule')
    def test_good_case(self, mock_download_granule, mock_get_granule_link, mock_get_granules):
        ''' Test when main is called successfully
        '''
        mock_download_granule.return_value = 'test/Sample.HDF5'
        mock_get_granule_link.return_value = 'Mock link'
        mock_get_granules.return_value = 'Mock granules'

        response = main({'token': 'faketoken', 'conceptId': 'C1234-TEST'}, "")
        # Specify the path to your JSON file
        file_path = 'test/expected_response.json'

        # Open the JSON file for reading
        with open(file_path, 'r') as json_file:
            # Use json.load() to parse the JSON data into a Python variable
            expected_response = json.load(json_file)

        self.assertEqual(response, expected_response)
