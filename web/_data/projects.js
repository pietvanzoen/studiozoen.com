const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../utils/sanityClient.js')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateProject (project) {
  return {
    ...project,
    body: BlocksToMarkdown(project.body, { serializers, ...client.config() })
  }
}

async function getProjects () {
  const filter = groq`*[_type == "project" && defined(slug) && publishedAt < now()]`
  const projection = groq`{
    _id,
    publishedAt,
    title,
    slug,
    body[]
  }`
  const order = `| order(publishedAt asc)`
  const query = [filter, projection, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareProjects = reducedDocs.map(generateProject)
  console.log(prepareProjects);
  return prepareProjects
}

module.exports = getProjects
