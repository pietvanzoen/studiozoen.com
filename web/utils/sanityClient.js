require('dotenv').config()
const sanityClient = require("@sanity/client");

const { sanity } = require('../client-config')

module.exports = sanityClient({...sanity, useCdn: !process.env.SANITY_READ_TOKEN, token: process.env.SANITY_READ_TOKEN});
