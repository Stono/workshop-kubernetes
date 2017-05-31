'use strict';
const ViewModelBuilder = require('../lib/viewModelBuilder');
const Dal = require('../lib/dal');
const should = require('should');

describe('ViewModels', () => {
  let model, request, dal, builder;
  beforeEach(done => {
    dal = new Dal();
    builder = new ViewModelBuilder({ dal: dal });

    request = {
      user: {
        profile: {
          name: 'Karl Stoney'
        }
      }
    };
    dal.flushall(done);
  });
  afterEach(done => {
    dal.flushall(done);
  });
  const userInfo = () => {
    it('should have user info', () => {
      should(model.user).eql(request.user.profile);
    });
  };

  describe('withTitle', () => {
    beforeEach(done => {
      builder(request)
      .withTitle('title')
      .build((err, data) => {
        should.ifError(err);
        model = data;
        done();
      });
    });
    it('should set the title', done => {
      should(model.page.title).eql('title');
      done();
    });
  });

  describe('withUser', () => {
    beforeEach(done => {
      builder(request)
      .withUser()
      .build((err, data) => {
        should.ifError(err);
        model = data;
        done();
      });
    });
    userInfo();
    it('should throw an error if no user info found in the request', done => {
      builder({}).withUser().build(err => {
        should(err.message).eql('No user found in request');
        done();
      });
    });
  });

});
