//node lib/training-importer-cli.js -l http://192.168.50.4:3001 -a -u training_content-26 < Antique.json

var trainingImporter = require('./training-importer');
var TrainingOAuth = require('./training-oauth');
var aftereffects = require('./aftereffects');
var settingsLoader = require('./settings');

var program = require('commander');

program
  .version('0.0.1')
  .option('-l, --url [url]', 'Set the Training Factory base url')
  .option('-u, --update', 'Update mode')
  .option('-c, --create', 'Create mode')
  .option('-a, --aftereffects', 'AfterEffects mode')
  //.option('-b, --basepath [path]', 'Set the base path for locally referenced files')
  .option('-s, --settingsFile [file]', 'Settings file')
  .parse(process.argv);

if(program.create && program.update){
  console.error("Update and create modes are mutually exclusive");
}

if(program.update){
  if (program.args.length < 1) {
    console.error("No id given");
  }
}

var settings = {};

new settingsLoader(program.settingsFile).loadSettings(function(data){
  settings = data;
  if(program.url){
    settings.site = program.url;
  }
  login(settings);
});

function login(settings) {
  var trainingLogin = new TrainingOAuth();
  trainingLogin.login(settings, importData);
}


function importData(token) {
  var importer = new TrainingImporter(settings);

  importer.token = token;

  if (program.update || program.create || program.aftereffects) {
    var fileData = '';
    process.stdin.resume();
    process.stdin.on('data', function (data) {
      fileData += data;
    });
    process.stdin.on('end', function () {
      if (program.aftereffects) {

        console.log("AfterEffects mode");
        var data = JSON.parse(fileData);
        var afterData = new aftereffects(data);
        afterData.fix();
        afterData.uploadFiles();
        if (program.create) {
          importer.post(JSON.stringify(afterData.data), function (data) {
            console.log(data)
          });
        } else {
          if (program.args.length > 0) {
            importer.put(program.args[0], JSON.stringify(afterData.data), function (data) {
              console.log(data)
            });
          }
        }
      } else if (program.update) {
        if (program.args.length > 0) {
          importer.put(program.args[0], fileData, function (data) {
            console.log(data)
          });
        }
      } else {
        importer.post(fileData, function (data) {
          console.log(data)
        });
      }
    });
  } else {
    if (program.args.length > 0) {
      importer.get(program.args[0], function (data) {
        console.log(data)
      });
    }
  }
}
