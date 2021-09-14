export default {
  count: 21,
  items: [
    {
      id: 'C1200400824-GHRC',
      title: 'Infrared Global Geostationary Composite Demo 9',
      doi: '10.5067/GHRC/AMSU-A/DATA303',
      relationships: [
        {
          relationshipType: 'platformInstrument',
          platform: 'MTSAT-1R',
          instrument: 'VISSR'
        },
        {
          relationshipType: 'platformInstrument',
          platform: 'GOES-8',
          instrument: 'VISSR'
        },
        {
          relationshipType: 'platformInstrument',
          platform: 'METEOSAT-7',
          instrument: 'VISSR'
        },
        {
          relationshipType: 'relatedUrl',
          url: 'https://doi.org/10.5067/9LNYIYOBNBR5',
          description: 'Another Related URL for Demo',
          type: 'VIEW RELATED INFORMATION',
          subtype: 'DATA RECIPE'
        },
        {
          relationshipType: 'relatedUrl',
          url: 'http://ghrc.nsstc.nasa.gov/uso/ds_docs/globalir/globalir_dataset.html',
          type: 'VIEW RELATED INFORMATION',
          subtype: "USER'S GUIDE"
        }
      ]
    }
  ]
}
