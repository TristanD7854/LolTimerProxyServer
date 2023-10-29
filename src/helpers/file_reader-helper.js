const fs = require('fs');

exports.getVersionUpdated = function (filePath) { // todo : get date instead of version, as its not updated in time
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const dataObject = JSON.parse(data);
    return dataObject.version;
  } catch (err) {
    throw new Error("File not found");
  }
};
  
exports.getInformation = function (filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const dataObject = JSON.parse(data);
    return dataObject;
  } catch (err) {
    console.error(err);
  }
};
  