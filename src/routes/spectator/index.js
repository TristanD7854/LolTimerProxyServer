/* eslint-disable no-unused-vars */
const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');

const API_BASE_URL_SPECTATOR = process.env.API_BASE_URL_SPECTATOR;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

var spectatorMockData = require('./mockData/deferlisGame.json');
var summonerIdNotFoundMockData = require('./mockData/summonerIdNotFound.json');
var summonerNotInGameMockData = require('./mockData/summonerNotInGame.json');

var urlUtils = require('../../helpers/url-helper');

router.get('/', async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query
    });

    const encryptedSummonerId = urlUtils.getQueryParameter(
      params,
      'encryptedSummonerId'
    );

    if (!encryptedSummonerId) {
      res.status(400).json({
        status: {
          message: 'No encryptedSummonerId parameter given',
          status_code: 400
        }
      });
      return;
    }

    const finalParams = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE
    });

    const apiUrl = `${API_BASE_URL_SPECTATOR}/${encryptedSummonerId}?${finalParams}`;
    const apiResponse = await needle('get', apiUrl);
    const data = apiResponse.body;

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${apiUrl}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/mock', async (req, res) => {
  try {
    res.status(200).json(spectatorMockData);
    //res.status(400).json(summonerIdNotFoundMockData)
    //res.status(404).json(summonerNotInGameMockData)
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
