import React from 'react';
import expect from 'expect';
import Auth0Lock from 'auth0-lock';
import TestUtils from 'react-addons-test-utils';

import Lock from '../lock.component';


describe('lock: ', function () {
  var auth0Lock;
  beforeEach(() => {
    auth0Lock = Auth0Lock('CLIENT_ID', 'DOMAIN');
  });
  it('renders without problems', function () {
    var lock = TestUtils.renderIntoDocument(<Lock clientID={"CLIENT_ID"} domain={"DOMAIN"}/>);
    expect(lock).toExist();
  });
});
