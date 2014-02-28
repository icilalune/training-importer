var sys  = require('util'),
  trainingImporter = require('./training-importer'),
  repl = require('repl');


var program = require('commander');

program
  .version('0.0.1')
  .option('-l, --url [url]', 'Set the Training Factory base url')
  .option('-u, --update', 'Update mode')
  .option('-c, --create', 'Create mode')
  .parse(process.argv);

if(program.create && program.update){
  console.error("Update and create modes are mutually exclusive");
}

var importer = new TrainingImporter(program.url);

if (program.update || program.create) {
  var fileData = '';
  process.stdin.resume();
  process.stdin.on('data', function (data) {
    fileData += data;
  });
  process.stdin.on('end', function () {
    if (program.update) {
      if (program.args.length > 0) {
        importer.put(program.args[0], fileData);
      }
    } else {
      importer.post(fileData);
    }
  });
} else {
  if (program.args.length > 0) {
    importer.get(program.args[0], function(data){console.log(data)});
  }
}
