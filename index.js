const express = require('express')
const cors = require('cors')

const { extract } = require('article-parser/dist/cjs/article-parser.js')

const app = express()

app.use(cors())

const isValidUrl = (url = '') => {
  try {
    const ourl = new URL(url)
    return ourl !== null && ['https:', 'http:'].includes(ourl.protocol)
  } catch (err) {
    return false
  }
}

app.get('/', async (req, res) => {
  const { query = {}, originalUrl } = req
  const { url = '' } = query

  if (!url || !isValidUrl(url)) {
    console.log(`Deny a bad request: ${originalUrl}`)
    return res.status(400).json({
      error: 1,
      message: 'Required parameter `url` is missing or invalid',
      data: null
    })
  }

  const result = {
    error: 1,
    message: `Could not extract article from "${url}"`,
    data: null
  }

  try {
    console.log(`Extract article from ${url}`)
    const article = await extract(url)
    result.error = 0
    result.message = 'Article data has been read successfuly'
    result.data = article
  } catch (err) {
    result.message = err.message || String(err) || 'Something went wrong'
    console.log(`Article extracting failed: ${result.message}`)
  }

  return res.json(result)
})

module.exports = app
