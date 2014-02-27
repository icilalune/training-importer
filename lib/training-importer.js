var restler = require('restler');

TrainingImporter = function (baseUrl) {

  this.baseUrl = baseUrl;

}

TrainingImporter.prototype.get = function (id) {

  var serviceUrl = this.baseUrl + "/api/web/object/" + id;

  var request = restler.get(serviceUrl, {headers: {Accepts: 'application/json'}});

  request.on('complete', function (result, response) {
    console.log(result);
  });


}

TrainingImporter.prototype.put = function (id, data) {

  var serviceUrl = this.baseUrl + "/api/web/object/" + id;

  var request = restler.put(serviceUrl, {
    data: data,
    headers: {
      "Accepts": 'application/json',
      "Content-Type": "application/json"
    }
  });

  request.on('complete', function (result, response) {
    console.log(response.statusCode);
    console.log(result);
  });

}


TrainingImporter.prototype.post = function (data) {

  var serviceUrl = this.baseUrl + "/api/web/object";

  console.log("post " + data);

  var request = restler.post(serviceUrl, {
    data: data,
    headers: {
      "Accepts": 'application/json',
      "Content-Type": "application/json"
    }
  });

  request.on('complete', function (result, response) {
    console.log(response.statusCode);
    console.log(result);
  });

}

exports = {
  TrainingImporter: TrainingImporter
};

