import os
import json

from unittest import TestCase, mock
from unittest.mock import patch
from handler import main

@mock.patch.dict(os.environ, {"cmrRootUrl": "https://cmr-example"})
class HandlerTest(TestCase):
    ''' A class for testing main function of handler.py
    '''
    def test_missing_auth_header(self):
        ''' Test when main is called with a missing auth_header in the event paramter
        '''
        response = main({'conceptId': 'C1234-TEST'}, "")
        expected_response = {'body': {'error': 'Collection Concept ID and Authentication Header must be provided.'},
                             'isBase64Encoded': False,
                             'statusCode': 500}
        self.assertEqual(response, expected_response)

    def test_missing_concept_id(self):
        ''' Test when main is called with a missing conceptId in the event paramter
        '''
        response = main({'authHeader': 'fake header'}, "")
        expected_response = {'body': {'error': 'Collection Concept ID and Authentication Header must be provided.'},
                             'isBase64Encoded': False,
                             'statusCode': 500}
        self.assertEqual(response, expected_response)

    @patch('handler.generate_collection_umm_var')
    def test_generate_case(self, mock_generate_collection_umm_var):
        ''' Test when main is called successfully
        '''
        # Specify the path to your JSON file
        file_path = 'test/variables.json'

        # Open the JSON file for reading
        with open(file_path, 'r') as json_file:
            # Use json.load() to parse the JSON data into a Python variable
            mock_response = json.load(json_file)

        # Set the mock's return value
        mock_generate_collection_umm_var.return_value = mock_response

        # Call the main function
        response = main({'authHeader': 'fake header', 'conceptId': 'C1234-TEST'}, "")

        # Specify the path to your JSON file
        file_path = 'test/expected_generate_response.json'

        # Open the JSON file for reading
        with open(file_path, 'r') as json_file:
            # Use json.load() to parse the JSON data into a Python variable
            expected_response = json.load(json_file)

        self.maxDiff = None
        self.assertEqual(response, expected_response)

    @patch('handler.generate_collection_umm_var')
    def test_publish_case(self, mock_generate_collection_umm_var):
        ''' Test when main is called successfully
        '''
         # Set the mock's return value
        mock_generate_collection_umm_var.return_value = ['V0001-TEST', 'V0002-TEST']

        # Call the main function
        response = main({'authHeader': 'fake header', 'conceptId': 'C1234-TEST', 'publish': True}, "")

        # Specify the path to your JSON file
        file_path = 'test/expected_publish_response.json'

        # Open the JSON file for reading
        with open(file_path, 'r') as json_file:
            # Use json.load() to parse the JSON data into a Python variable
            expected_response = json.load(json_file)

        self.maxDiff = None
        self.assertEqual(response, expected_response)
