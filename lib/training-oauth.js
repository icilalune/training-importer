

function TrainingOAuth() {
};

TrainingOAuth.prototype.login = function(settings, callback){
  settings.useBasicAuthorizationHeader = false;
  var token;
  var OAuth2 = require('simple-oauth2')({
    clientID: settings.clientID,
    clientSecret: settings.clientSecret,
    site: settings.site,
    tokenPath: settings.tokenPath,
    scope: settings.scope,
    useBasicAuthorizationHeader:false
  });
  OAuth2.Password.getToken({
    client_id: settings.clientID,
    client_secret: settings.clientSecret,
    username: settings.username,
    password:  settings.password,
    scope: ['basic'],
  }, function (error, result) {
    if (error) {
      console.log('Access Token Error', error.message);
      callback(null);
    }
    else {
      callback(OAuth2.AccessToken.create(result));
    }
  });
};

module.exports = TrainingOAuth;


