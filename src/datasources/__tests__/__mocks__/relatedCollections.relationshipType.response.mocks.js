export default {
  count: 21,
  items: [
    {
      id: 'C1200400824-GHRC',
      title: 'Infrared Global Geostationary Composite Demo 9',
      doi: '10.5067/GHRC/AMSU-A/DATA303',
      relationships: [
        {
          instrument: 'VISSR',
          platform: 'MTSAT-1R',
          relationshipType: 'platformInstrument'
        },
        {
          instrument: 'VISSR',
          platform: 'GOES-8',
          relationshipType: 'platformInstrument'
        },
        {
          instrument: 'VISSR',
          platform: 'METEOSAT-7',
          relationshipType: 'platformInstrument'
        },
        {
          description: 'Another Related URL for Demo',
          subtype: 'DATA RECIPE',
          type: 'VIEW RELATED INFORMATION',
          url: 'https://doi.org/10.5067/9LNYIYOBNBR5',
          relationshipType: 'relatedUrl'
        },
        {
          subtype: "USER'S GUIDE",
          type: 'VIEW RELATED INFORMATION',
          url: 'http://ghrc.nsstc.nasa.gov/uso/ds_docs/globalir/globalir_dataset.html',
          relationshipType: 'relatedUrl'
        }
      ]
    }
  ]
}
