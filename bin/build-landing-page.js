/**
 * This script loads the landing page index.html file, takes environment variables
 * and replaces the placeholders in the HTML file with the actual values using Handlebars.
 * It then writes the output to a new file.
 */

import {
  readFile,
  mkdir,
  writeFile
} from 'fs/promises'
import Handlebars from 'handlebars'

const {
  STAGE_NAME,
  GTM_ID,
  VERSION
} = process.env

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

const graphqlHost = `https://graphql${env}.earthdata.nasa.gov`

// Data to be injected into the template
const data = {
  graphqlHost,
  version: VERSION,
  gtmId: GTM_ID
}

const filename = 'index.html'

const landingPageDir = './landing-page'
const landingPageTemplatePath = `${landingPageDir}/${filename}`

const outputDir = './landing-page-build'
const outputPath = `${outputDir}/${filename}`

// Read the landing page template
const landingPageTemplate = await readFile(landingPageTemplatePath, 'utf8')
const template = Handlebars.compile(landingPageTemplate, { noEscape: true })

// Replace the placeholders in the template with actual values
const html = template(data)

// Create the output directory if it doesn't exist
await mkdir(outputDir)

// Write the output to a file
await writeFile(outputPath, html, 'utf8')
