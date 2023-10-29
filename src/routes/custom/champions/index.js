/* eslint-disable no-unused-vars */
const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');

//var akaliJson = require('./akali/akali.json');
var urlUtils = require('../../../helpers/url-helper');
var fileWriterUtils = require('../../../helpers/file_writer-helper');
var fileReaderUtils = require('../../../helpers/file_reader-helper');

router.get('/', async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query
    });

    const championName = urlUtils.getQueryParameter(
      params,
      'championName'
    );

    if (!championName) {
      res.status(400).json({
        status: {
          message: 'No championName parameter given',
          status_code: 400
        }
      });
      return;
    }

    const championFilePath = `src/routes/custom/champions/${championName}/${championName}.json`;

    // todo use date instead of version (see getVersionUpdated)

    let championVersion = "";
    try {
      championVersion = fileReaderUtils.getVersionUpdated(championFilePath);
    } catch (err) {
      res.status(400).json({
        status: {
          message: 'champion not found',
          status_code: 400
        }
      });
      return;
    }

    const version = fileReaderUtils.getVersionUpdated("src/routes/custom/version.json");

    if (championVersion != version) {
      const championUrl = `https://raw.communitydragon.org/${version}/game/data/characters/${championName}/${championName}.bin.json`;

      const apiResponse = await needle('get', championUrl);
      const data = apiResponse.body;

      let mappedData = mapChampionJson(data, version);

      try {
        fileWriterUtils.writeIntoFile(championFilePath, JSON.stringify(mappedData, null, 2))
      } catch (err) {
        console.log(err);
      }

      /*
      besoin de akali.json (le bin.json en ligne) + fontconfig
      on récupère dans fontconfig le texte du spell, puis on cherche les variables @var@ dans akali.json,
      (exple : "akali deals @dmg@")
      si on trouve pas direct on calcule le hash puis on cherche (si pas trouvé on scrap le wiki :( )
      puis on remplace la val @val@ par ce qu'on a trouvé.
      On map ensuite pour pas avoir juste une string style : "akali deals [30,40]*ap"
      va yavoir les ratios dans akali.json : Cast2DamageMin->0.3 ... Cast2DamageMax->ratio:3   donc 30%*3 = 90%ap max
      on veut mettre la progression dans l'objet final cad [30, 90] pour ratios et [100,35] pour %hp qui influence le ratio

      chercher si pas moyen de créer un model en js, pour avoir une idée d'à quoi ressemble 
        l'objet Champion (qui aura des dizaines de propriétés)
      */

      if (process.env.NODE_ENV !== 'production') {
        console.log(`REQUEST: ${championUrl}`);
      }
    }

    const championCustomInfo = fileReaderUtils.getInformation(championFilePath);

    res.status(200).json(championCustomInfo);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;


function mapChampionJson(data, version) {
  let [key, value] = Object.entries(data)[0];

  let mappedData = {}
  mappedData[key] = value;
  mappedData.version = version;
  return mappedData;
}