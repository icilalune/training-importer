var fs = require('fs');
var path = require('path');

var TrainingImporterSettings = function(filename){
  if(!filename){
    filename = "factory.json";
  }
  this.filename = filename;
}

TrainingImporterSettings.prototype.loadSettings = function(callback){
  fs.readFile(this.filename, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    this.settings = JSON.parse(data);
    callback(this.settings);
  });
}

module.exports = TrainingImporterSettings;