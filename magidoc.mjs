const { pages } = await import(`./magidoc/pages.mjs?id=${Math.random()}`)

const { STAGE_NAME } = process.env
let env
switch (STAGE_NAME) {
  case 'sit':
    env = '.sit'
    break
  case 'uat':
    env = '.uat'
    break
  default:
    env = ''
    break
}

const url = `https://graphql${env}.earthdata.nasa.gov/api`

export default {
  introspection: {
    type: 'url',
    url
    // Uncomment to test introspection locally
    // url: 'http://127.0.0.1:3013/api'
  },
  website: {
    template: 'carbon-multi-page',
    staticAssets: './magidoc/assets',
    options: {
      appTitle: 'CMR GraphQL',
      // TODO get a pretty logo from Trevor
      appLogo: 'https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg',
      appFavicon: '/favicon.ico',
      pages,
      externalLinks: [
        {
          href: 'https://github.com/nasa/cmr-graphql',
          label: 'GitHub',
          position: 'header',
          kind: 'Github'
        },
        {
          href: url,
          label: 'API',
          position: 'header'
        }
      ],
      fieldsSorting: 'alphabetical',
      argumentsSorting: 'alphabetical'
    }
  }
}
