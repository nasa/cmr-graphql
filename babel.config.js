module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '12.16.3',
          esmodules: true
        }
      }
    ]
  ],
  sourceType: 'unambiguous'
}
