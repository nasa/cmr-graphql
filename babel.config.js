module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '14',
          esmodules: true
        }
      }
    ]
  ],
  sourceType: 'unambiguous'
}
