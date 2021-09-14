export default {
  count: 18,
  items: [
    {
      id: 'C1200400792-GHRC',
      title: 'Infrared Global Geostationary Composite Demo 4',
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
          relationshipType: 'relatedUrl',
          url: 'http://ghrc.nsstc.nasa.gov/uso/ds_docs/globalir/globalir_dataset.html',
          type: 'VIEW RELATED INFORMATION',
          subtype: "USER'S GUIDE"
        }
      ]
    }
  ]
}
