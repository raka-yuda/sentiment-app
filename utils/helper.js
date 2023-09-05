const fs = require('fs');

module.exports = {
    writeJsonData : async (ouputFile, data) => {
        fs.writeFile(`./data/${ouputFile}.json`, JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log('Write Completed');
        });
    },
    
    readJsonData : (file) => {
        const data = fs.readFileSync(`./data/${file}.json`, function (err) {
            if (err) throw err;
        });
        return JSON.parse(data);
    }
    
}