'use strict';

var unirest = require('unirest');

var Promise = require('bluebird');

class HootApi {

  constructor({hs_client_id, hs_client_secret, username, password, memberId, organizationId}) { 
    this.hs_client_id = hs_client_id;
    this.hs_client_secret = hs_client_secret;
    this.username = username;
    this.password = password;
    this.memberId = memberId;
    this.organizationId = organizationId;
    this.organizationAccessToken = null;
    this.memberAccessToken = null;
    this.passwordAccessToken = null;
  }

  getPasswordAccessToken() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.passwordAccessToken != null) {
        resolve(self.passwordAccessToken);
      } else {
        unirest.post('https://apis.hootsuite.com/auth/oauth/v2/token')
        .headers({'Content-Type': 'application/x-www-form-urlencoded'})
        .send('grant_type=password')
        .send('username=' + this.username)
        .send('password=' + this.password)
        .send('client_id=' + this.hs_client_id)
        .send('client_secret=' + this.hs_client_secret)
        .end(function (response) {
          self.passwordAccessToken = response.body;
          resolve(response.body);
        });
      }
    });
  }

  getClientCredentialsAccessToken() {
    return new Promise((resolve, reject) => {
      unirest.post('https://apis.hootsuite.com/auth/oauth/v2/token')
      .headers({'Content-Type': 'application/x-www-form-urlencoded'})
      .send('grant_type=client_credentials')
      .send('client_id=' + this.hs_client_id)
      .send('client_secret=' + this.hs_client_secret)
      .end(function (response) {
        resolve(response.body);
      });
    });
  }

  getOrganizationAccessToken(hs_access_token) {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.organizationAccessToken != null) {
        resolve(self.organizationAccessToken);
      } else {
        unirest.post('https://apis.hootsuite.com/v1/tokens')
        .type('json')
        .headers({'Authorization': 'Bearer ' + hs_access_token})
        .send({
          "organizationId": this.organizationId
         })
        .end(function (response) {
          self.organizationAccessToken = response.body;
          resolve(response.body);
        });
      }
    });
  }

  getMemberAccessToken(hs_access_token) {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.memberAccessToken != null) {
        resolve(self.memberAccessToken);
      } else {
        unirest.post('https://apis.hootsuite.com/v1/tokens')
        .type('json')
        .headers({'Authorization': 'Bearer ' + hs_access_token})
        .send({
          "memberId": this.memberId
         })
        .end(function (response) {
          self.memberAccessToken = response.body;
          resolve(response.body);
        });
      }
    });
  }

  header() {
    var self = this;
    return Promise.coroutine(function* () {
      if (self.username != null && self.password != null) {
        var token = yield self.getPasswordAccessToken();
      } else if (self.memberId != null) {
        var accessToken = yield self.getClientCredentialsAccessToken();
        var token = yield self.getMemberAccessToken(accessToken.access_token);
      } else if (self.organizationId != null) {
        var accessToken = yield self.getClientCredentialsAccessToken();
        var token = yield self.getOrganizationAccessToken(accessToken.access_token);
      } else {
        throw "not configured correctly";
      }

      console.log(token);

      return({'Authorization': 'Bearer ' + token.access_token});

     })();
  }

  me() {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.get('https://apis.hootsuite.com/v1/me')
        .headers(authHeader)
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  member({memberId}) {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.get('https://apis.hootsuite.com/v1/members/' + memberId)
        .headers(authHeader)
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  socialProfiles() {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.get('https://apis.hootsuite.com/v1/socialProfiles')
        .headers(authHeader)
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  socialProfile({socialProfileId}) {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.get('https://apis.hootsuite.com/v1/socialProfiles/' + socialProfileId)
        .headers(authHeader)
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  sendMessage({message, socialProfileId, webhookUrl}) {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.post('https://apis.hootsuite.com/v1/messages')
        .type('json')
        .headers(authHeader)
        .send({
	  "text": message,
          "socialProfileIds": [ 
            socialProfileId
          ],
          "webhookUrls": [
            webhookUrl
          ],
          "targeting": null,
          "privacy": null,
          "location": null,
          "emailNotification": true
     	})
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  getMessage({messageId}) {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.get('https://apis.hootsuite.com/v1/messages/' + messageId)
        .type('json')
        .headers(authHeader)
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  acceptMessage({messageId}) {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.post('https://apis.hootsuite.com/v1/messages/' + messageId + '/approve')
        .type('json')
        .headers(authHeader)
        .send({
          "sequenceNumber": "1",
          "reviewerType": "EXTERNAL"
        })
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  rejectMessage({messageId, rejectReason}) {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.post('https://apis.hootsuite.com/v1/messages/' + messageId + '/reject')
        .type('json')
        .headers(authHeader)
        .send({
          "sequenceNumber": "1",
          "reviewerType": "EXTERNAL"
          "reason": rejecetReason
        })
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

  organizationMembers() {
    var self = this;
    return Promise.coroutine(function* () {
      var authHeader = yield self.header();

      return new Promise(function(resolve, reject) {
        unirest.get('https://apis.hootsuite.com/v1/organizations/' + self.organizationId + '/members')
        .headers(authHeader)
        .end(function (response) {
          resolve(response.body);
        });
      });
    })();
  }

}

module.exports = HootApi;

