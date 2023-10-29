const fs = require('fs');
const util = require('util');

exports.writeIntoFile = function (filePath, content) {
    try {
        const data = fs.writeFileSync(filePath, content, util.inspect(json));
    } catch (err) {
        console.log(err);
        throw new Error("Error when writing");
    }
  };
  