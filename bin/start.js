const concurrently = require('concurrently')

concurrently([{
  command: 'npm run watch',
  name: 'watch'
}, {
  command: 'npm run offline',
  name: 'api'
}], {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true
})
