var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


var finished = false;

var Uploader = function (host, port, path, method, filename, checkInterval) {

  EventEmitter.call(this);

  this.host = host;
  this.port = port;
  this.path = path;
  this.method = method;
  this.filename = filename;
  this.checkInterval = checkInterval;

}

util.inherits(Uploader, EventEmitter);

module.exports = Uploader;

Uploader.prototype.upload = function () {

  var uploader = this;
  var request = http.request({
    host: this.host,
    port: this.port,
    path: this.path,
    method: this.method,
    headers: {
    }
  }, function (response) {
    var data = '';
    response.on('data', function (chunk) {
      data += chunk.toString();
    });
    response.on('end', function () {
      var result = JSON.parse(data);
      this.fid = result.fid;
      console.log(data);
      uploader.emit('end', this);
    });
  });

  var stat = fs.statSync(this.filename);

  var uploadId = Math.random().toString(16); // random string

  function checkProgress() {
//    var progressRequest = http.request({
//      host: '192.168.50.4',
//      port: '3001',
//      path: '/entity-object/file/progress/' + uploadId,//+'?XDEBUG_SESSION_START=11666',
//      method: 'GET',
//      headers: {
//      }
//    }, function (response) {
//      var data = '';
//      response.on('data', function (chunk) {
//        data += chunk.toString();
//      });
//      response.on('end', function () {
//        //console.log(data);
//        var progress = JSON.parse(data);
//
//        if (progress) {
//
//          console.log("progress: " + Math.round(progress.bytes_uploaded / stat.size * 100) + '%');
//          setTimeout(checkProgress, 500);
//
//        }
//
//      });
//    });
//    progressRequest.end();
  }


  console.log("file size: " + stat.size);

  var boundaryKey = Math.random().toString(16); // random string
  request.setHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryKey + '"');
// the header for the one and only part (need to use CRLF here)
  request.write(
    '--' + boundaryKey + '\r\n'
      // use your file's mime type here, if known
      + 'Content-Type: application/octet-stream\r\n'
      // "name" is the name of the form field
      // "filename" is the name of the original file
      + 'Content-Disposition: form-data; name="UPLOAD_IDENTIFIER"\r\n'
      + '\r\n'
      + uploadId + '\r\n'
  );
  request.write(
    '--' + boundaryKey + '\r\n'
      // use your file's mime type here, if known
      + 'Content-Type: application/octet-stream\r\n'
      // "name" is the name of the form field
      // "filename" is the name of the original file
      + 'Content-Disposition: form-data; name="files[entity_object_file]"; filename="'+path.basename(this.filename)+'"\r\n'
      + 'Content-Length: ' + stat.size + '\r\n'
      + 'Content-Transfer-Encoding: binary\r\n\r\n'
  );



  fs.createReadStream(this.filename, { bufferSize: 4 * 1024 })

    .on('end', function () {
      // mark the end of the one and only part
      request.end('\r\n--' + boundaryKey + '--');
      finished = true;

    })
    .on('data', function (chunk) {
      request.write(chunk);
    })

  checkProgress();

  // set "end" to false in the options so .end() isn't called on the request
  //.pipe(request, { end: false }) // maybe write directly to the socket here?

}
