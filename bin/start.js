const concurrently = require('concurrently')

concurrently([{
  command: 'npm run watch',
  name: 'watch'
}, {
  command: 'sam local start-api -t ./cdk/earthdata-access/cdk.out/earthdata-access-dev.template.json --warm-containers LAZY --port 5001 --docker-network host',
  name: 'api'
}], {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true
})
