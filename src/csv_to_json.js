exports.convertmyfile  = (filename) => {
    let csvtojson = require('convert-csv-to-json');
    let jsonData = csvtojson.fieldDelimiter(',').formatValueByType().getJsonFromCsv(filename);
    return jsonData;
}