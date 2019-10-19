
var fs = require('fs');
var path = require('path');
var togeojson = require('@mapbox/togeojson');
var DOMParser = require('xmldom').DOMParser;

dirName = "C:/Users/yuise/crisis-news-mapper/functions/data/nlftp.mlit.go.jp/W05";

fs.readdir(dirName, function(err, files){
    if (err) throw err;
    files.forEach(function (filename) {
        if (!filename.endsWith('.xml')){return;}
        var readFilePath = dirName+path.sep+filename;
        var kml = new DOMParser().parseFromString(fs.readFileSync(readFilePath, 'utf8'));
        var converted = togeojson.kml(kml);
        var writeFilePath = readFilePath.replace('.xml', '.geojson');
        fs.writeFileSync(writeFilePath, JSON.stringify(converted));
    });
});



