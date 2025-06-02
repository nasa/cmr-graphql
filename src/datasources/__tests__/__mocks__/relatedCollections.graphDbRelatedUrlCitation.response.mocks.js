export default {
  count: 7,
  items: [
    {
      providerId: 'PROV3',
      permittedGroups: 'guest',
      id: 'C1200000017-PROV3',
      abstract: 'This is a sample collection for SHORT_NAME_5_1748885319 created at 2025-06-02T17:28:39.275Z',
      title: 'Entry Title 5 1748885319',
      shortName: 'SHORT_NAME_5_1748885319',
      doi: '10.5067/TestSHORT_NAME_5_1748885319_1748885319',
      relationships: [
        {
          relationshipType: 'relatedUrl',
          description: 'Service capabilities document',
          type: 'GET CAPABILITIES',
          url: 'https://data.nasa.gov/lpdaac/services?request=GetCapabilities'
        },
        {
          relationshipType: 'citation',
          identifier: '10.5067/SAMPLE/DATA.3.1748885323',
          providerId: 'PROV1',
          name: 'Earth Science Dataset 3',
          id: 'CIT1200000025-PROV1',
          identifierType: 'DOI',
          abstract: 'This is a randomly generated citation for demonstration purposes. Created at 2025-06-02T17:28:43.056Z.',
          title: 'Earth Science Dataset 3 - Research Publication 3'
        }
      ]
    }
  ]
}
