const url = require('url') 
const express = require('express')
const router = express.Router()
const needle = require('needle')

const API_BASE_URL_SUMMONER = process.env.API_BASE_URL_SUMMONER
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

var summonerMockData = require('./mockData/deferlis.json');
var summonerNotFoundMockData = require('./mockData/summonerNotFound.json');

var urlUtils = require('../../url-helper');

router.get('/', async (req, res) => {
    try {
        const params = new URLSearchParams({
           ...url.parse(req.url, true).query
        })

        const summonerName = urlUtils.getQueryParameter(params, "summonerName")

        if (!summonerName)
        {
            res.status(400).json(
            {
                "status": {
                    "message": "No summonerName parameter given",
                    "status_code": 400
                }
            })
            return
        }

        const finalParams = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE
        })

        const apiUrl = `${API_BASE_URL_SUMMONER}/${summonerName}?${finalParams}`
        const apiResponse = await needle('get', apiUrl)
        const data = apiResponse.body

        // Log the request to the public API
        if (process.env.NODE_ENV !== 'production') {
            console.log(`REQUEST: ${apiUrl}`)
        }
    
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({error})
    }
})

router.get('/mock', async (req, res) => {
    try {    
        res.status(200).json(summonerMockData)
        //res.status(404).json(summonerNotFoundMockData)
    }
    catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router
