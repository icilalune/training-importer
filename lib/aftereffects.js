
var Uploader = require('./uploader');

function AfterEffectsExport(data){
  this.data = data;
}

AfterEffectsExport.prototype.fix = function(){

  if (this.data.label && !this.data.label["en"]) {
    this.data.label = {"en": this.data.label};
  }

  if (this.data.properties && !this.data.properties["en"]) {
    this.data.properties = {"en": this.data.properties};
  }

  this.data._meta = {"entityType": "training_content"};


  if(this.data.markers) {
    for (var i = 0; i < this.data.markers.length; i++) {
      this.data.markers[i].type = "marker";
    }
  }
}

AfterEffectsExport.prototype.uploadFiles = function(){

  for(var i = 0; i < this.data.contents.length; i++){

    if(this.data.contents[i].type == "media" && this.data.contents[i].file && this.data.contents[i].file.localPath){

      console.log("Upload " + this.data.contents[i].file.localPath);

      var uploader = new Uploader('192.168.50.4', '3001', '/entity-object/file/upload', 'POST', this.data.contents[i].file.localPath);
      uploader.on('end', function (res) {
        this.data.contents[i].file.id = res.fid;
        callback(JSON.stringify(object));
      });
      uploader.upload();


    }

  }

}

module.exports = AfterEffectsExport;