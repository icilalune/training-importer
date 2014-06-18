var restler = require('restler');
var Uploader = require('./uploader');

TrainingImporter = function (settings) {
  this.baseUrl = settings.site;
  this.serviceEndpoint = settings.serviceEndpoint;
  if(!this.serviceEndpoint){
    this.serviceEndpoint = "/rest/object";
  }
};

TrainingImporter.prototype.get = function (id, callback) {
  var serviceUrl = this.baseUrl + this.serviceEndpoint + "/" + id;
  console.log("GET " + serviceUrl);
  var request = restler.get(serviceUrl, {
    headers: {
      Accepts: 'application/json',
      Authorization: 'Bearer ' + this.token.token.access_token
    }
  });
  request.on('complete', function (result, response) {
    console.log("Status: " + response.statusCode);
    callback(response.raw.toString());
  });
};

TrainingImporter.prototype.handleData = function (data, callback) {

//  var object = JSON.parse(data);
//
//  console.log(object);

//  if (object && object._meta && object._meta.entityType == 'training_content' && object.type == 'media' && object.file.localPath) {
//
//    console.log("Upload " + object.file.localPath);
//
//    var Uploader = require('./uploader');
//
//    var uploader = new Uploader('192.168.50.4', '3001', '/entity-object/file/upload', 'POST', object.file.localPath);
//    uploader.on('end', function (res) {
//      object.file.id = res.fid;
//      callback(JSON.stringify(object));
//    });
//    uploader.upload();
//
//  }else{
    callback(data);
//  }

}

TrainingImporter.prototype.put = function (id, data, callback) {
  var serviceUrl = this.baseUrl + this.serviceEndpoint + "/" + id;
  var token = this.token;
  this.handleData(data, function (data) {
    console.log("PUT " + serviceUrl);
    var request = restler.put(serviceUrl, {
      data: data,
      headers: {
        "Accepts": 'application/json',
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + token.token.access_token
      }
    });
    request.on('complete', function (result, response) {
      console.log("Status: " + response.statusCode);
      callback(result);
    });
  });
};


TrainingImporter.prototype.post = function (data, callback) {
  var serviceUrl = this.baseUrl+ this.serviceEndpoint + "?XDEBUG_SESSION_START=remote";
  var token = this.token;
  this.handleData(data, function (data) {
    console.log("POST " + serviceUrl);
    var request = restler.post(serviceUrl, {
      data: data,
      headers: {
        "Accepts": 'application/json',
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + token.token.access_token
      }
    });
    request.on('complete', function (result, response) {
      console.log("Status: " + response.statusCode);
      callback(result);
    });
  });
};

exports = {
  TrainingImporter: TrainingImporter
};
