/* eslint-disable no-unused-vars */
const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');

const API_BASE_URL_LEAGUE = process.env.API_BASE_URL_LEAGUE;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

var urlUtils = require('../../helpers/url-helper');

var summonerRankMockData = require('./mockData/yseurRank.json');

router.get('/', async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query
    });

    const encryptedSummonerId = urlUtils.getQueryParameter(params, 'encryptedSummonerId');

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

    const apiUrl = `${API_BASE_URL_LEAGUE}/${encryptedSummonerId}?${finalParams}`;
    const apiResponse = await needle('get', apiUrl);
    const data = apiResponse.body;

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${apiUrl}`);
    }

    if (data?.status?.status_code && data?.status?.status_code != 200)
    {
      res.status(data.status.status_code).json(data);
    }
    else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/mock', async (req, res) => {
  try {
    res.status(200).json(summonerRankMockData);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
