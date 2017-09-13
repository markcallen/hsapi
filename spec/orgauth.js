var should = require('should');
var assert = require('assert');
var fs = require('fs');
var HsApi = require('../index.js');

var helper = require('./helper');

describe('Org Auth', function() {
  describe('Valid OrgId', function() {
    var hsapi = new HsApi({hs_client_id: helper.hs_client_id, hs_client_secret: helper.hs_client_secret, organizationId: helper.organizationId});
    it('member '+helper.memberId, function(done) {
      hsapi.member({memberId: helper.memberId}).then(function(res) {
        res.data.should.have.property('id');
        done();
      });
    });

    it('social profiles', function(done) {
      hsapi.socialProfiles().then(function(res) {
        res.data.should.be.an.instanceOf(Array);
        res.data[0].should.have.property('id');
        done();
      });
    });

    it('get new auth token', function(done) {
      hsapi.setExpiresAt(-1000);
      hsapi.member({memberId: helper.memberId}).then(function(res) {
        res.data.should.have.property('id');
        done();
      });
    });
  });

});
