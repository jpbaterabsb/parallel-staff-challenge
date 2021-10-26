const csv = require('csv-parser')
const fs = require('fs')
const camelCase = require('camelcase');

exports.extractDataFromCSV = async (path, deleteAfterRead = false) => {

    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(csv({
                separator: '|',
                mapHeaders: ({ header }) => camelCase(header)
            }))
            .on('data', (data) => {
                results.push(data)
            })
            .on('error', (err) => reject(err))
            .on('end', () => {
                if(deleteAfterRead) {
                    fs.unlinkSync(path);
                }
                resolve(results);
            });

    });
};

exports.getPath = (req) => __dirname + '/../../' + req.file.filename;
