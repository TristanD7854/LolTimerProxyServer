const url = require('url'); // part of node, no need to install it
const express = require('express');
const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');

// Env vars, get them from .env
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;
const API_BASE_URL_SPECTATOR = process.env.API_BASE_URL_SPECTATOR;

// Init cache
let cache = apicache.middleware;
/* Setting it to 2 minutes makes it so same call (with same parameters) will not trigger another API call, it will give back the result of the first call, for 2 minutes.
It will continue counting down the rate-limiting during that, but as it is caching, it will only give errors after the cache period, if rate limiting triggered.
If is is constantly updating, having too big of a period is not ideal, as it will only update every amount of time equal to the cache period. */

// TODO : one route/folder for endpoint !

router.get('/', cache('30 secondes'), async (req, res) => {
  try {
    console.log(url.parse(req.url, true).query);

    /* todo : think about the different express endpoints
        For example, we don't use query parameters for the riot API /summoner/v4, but we will use them for our express server
        So we have to see if ?summoner=Zeferlis in the url, and call the corresponding riot API endpoint
        Same for other riot API endpoints
        */

    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query
    });

    // todo : remove all this to make it clean with 2 routes folder
    let hasAskedForSpectator = false;
    let encryptedSummonerId = '';
    let summonerName = '';
    for (const [key, value] of params.entries()) {
      if (key === 'encryptedSummonerId') {
        hasAskedForSpectator = true;
        encryptedSummonerId = value;
      }
      if (key === 'summonerName') {
        summonerName = value;
      }
    }

    const finalParams = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE
    });

    let apiUrl;
    if (hasAskedForSpectator) {
      apiUrl = `${API_BASE_URL_SPECTATOR}/${encryptedSummonerId}?${finalParams}`;
    } else {
      apiUrl = `${API_BASE_URL}/${summonerName}?${finalParams}`;
    }
    const apiRes = await needle('get', apiUrl);
    const data = apiRes.body;

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${apiUrl}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
