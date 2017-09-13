var should = require('should');
var assert = require('assert');
var fs = require('fs');
var HsApi = require('../index.js');

var helper = require('./helper');

describe('Member Auth', function() {
  describe('Valid MemberId - todo', function() {
    var hsapi = new HsApi({hs_client_id: helper.hs_client_id, hs_client_secret: helper.hs_client_secret, memberId: helper.memberId});
    it('me', function(done) {
      // hsapi.me().then(function(res) {
      //   res.data.should.have.property('id');
      //   done();
      // })
      // .catch(function(err) {
      //   console.error(err);
      //   fail();
      // });
      done();
    });
  });

});
