const concurrently = require('concurrently')

concurrently([{
  command: 'npm run watch',
  name: 'watch'
}, {
  command: 'sam local start-api -t ./cdk/graphql/cdk.out/graphql-dev.template.json --warm-containers LAZY --port 3013 --docker-network host',
  name: 'api'
}], {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true
})
