/*
const params = new URLSearchParams({
    ...url.parse(req.url, true).query
 })

 let encryptedSummonerId = ""
 for (const [key, value] of params.entries()) {
     if (key === "encryptedSummonerId") {
         encryptedSummonerId = value
     }
 }
 */

 exports.getQueryParameter = function(params, queryParameter) {
    foundValue = false
    for (const [key, value] of params.entries()) {
        if (key === queryParameter)
        {
            if (!foundValue) {
                foundValue = value
            }
            else
            {
                return false
            }
        }
    }
    return foundValue
}
