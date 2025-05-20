import { join } from 'path'
import { fileURLToPath } from 'url'
import {
  readFile,
  readdir,
  stat
} from 'fs/promises'
import Handlebars from 'handlebars'

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

const graphqlUrl = `https://graphql${env}.earthdata.nasa.gov/api`

/**
 * @param {import("fs").PathLike} dir
 * @returns {Promise<Array<{ dir: boolean; name: string; path: string; }>>}
 */
async function getFiles(dir) {
  /**
   * @type Array<{ dir: boolean; name: string; path: string; }>
   */
  const result = []
  const dirAsPathString = dir instanceof URL ? fileURLToPath(dir) : dir

  const dirContents = await readdir(dir)

  // eslint-disable-next-line no-restricted-syntax
  for (const item of dirContents) {
    const currentPath = join(dirAsPathString, item)

    // eslint-disable-next-line no-await-in-loop
    const currentPathStat = await stat(currentPath)

    result.push({
      dir: currentPathStat.isDirectory(),
      name: item,
      path: currentPath
    })
  }

  return result
}

/**
 * @param {{ dir: boolean; name: string; path: string; }} item
 * @returns {{ title: string; content: any }}
 */
async function asPage(item) {
  // 01.Introduction -> Introduction
  // 01.Welcome.md -> Welcome
  const title = item.name.split('.')[1]

  if (item.dir) {
    const filesInDirectory = await getFiles(item.path)

    return {
      title,
      content: await Promise.all(filesInDirectory.map((file) => asPage(file)))
    }
  }

  const content = await readFile(item.path, { encoding: 'utf-8' })

  // Replace {{graphqlUrl}} with the actual URL per environment
  const template = Handlebars.compile(content)
  const output = template({ graphqlUrl })

  return {
    title,
    content: output
  }
}

const pagesDirectory = new URL('./pages', import.meta.url)

const filesInPagesDirectory = await getFiles(pagesDirectory)

export const pages = await Promise.all(filesInPagesDirectory.map((item) => asPage(item)))
