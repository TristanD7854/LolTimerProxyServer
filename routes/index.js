const url = require('url') // part of node, no need to install it
const express = require('express')
const router = express.Router()
const needle = require('needle')

// Env vars, get them from .env
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

router.get('/', async (req, res) => {
    try {
        //console.log(url.parse(req.url, true).query);

        /* todo : think about the different express endpoints
        For example, we don't use query parameters for the riot API /summoner/v4, but we will use them for our express server
        So we have to see if ?summoner=Zeferlis in the url, and call the corresponding riot API endpoint
        Same for other riot API endpoints
        */

        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            ...url.parse(req.url, true).query
        })

        const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
        const data = apiRes.body

        // Log the request to the public API
        if (process.env.NODE_ENV !== 'production') {
            console.log(`REQUEST: ${API_BASE_URL}?${params}`)
        }
    
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router
