var should = require('should');
var assert = require('assert');
var fs = require('fs');
var HsApi = require('../index.js');

var helper = require('./helper');

describe('Password Auth', function() {
  describe('Valid Password', function() {
    var hsapi = new HsApi({hs_client_id: helper.hs_client_id, hs_client_secret: helper.hs_client_secret, username: helper.username, password: helper.password});
    it('me', function(done) {
      hsapi.me().then(function(res) {
        res.data.should.have.property('id');
        done();
      });
    });
  });

});
