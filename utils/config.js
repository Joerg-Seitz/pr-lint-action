const path = require('path')
const yaml = require('js-yaml')

const CONFIG_PATH = '.github'

/**
 * @returns {Promise<Object.<string, string | string[]>>}
 */
module.exports = async function getConfig(github, fileName, { owner, repo, ref }) {
  try {
    const response = await github.repos.getContents({
      owner,
      repo,
      ref: ref,
      path: path.posix.join(CONFIG_PATH, fileName)
    })

    return parseConfig(response.data.content)
  } catch (error) {
    if (error.status === 404) {
      return null
    }

    throw error
  }
}

function parseConfig(content) {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {}
}
