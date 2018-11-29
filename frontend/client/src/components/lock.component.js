import React from 'react';
import Auth0Lock from 'auth0-lock';
import PropTypes from 'prop-types';

class Lock extends React.Component {

  componentDidMount () {
    var clientID = this.props.clientID || this.props.clientId;
    if(!clientID) {
      throw Error("Client ID is strictly required");
    }
    var domain = this.props.domain;
    this.lock = new Auth0Lock(clientID, domain);
    this.hash = this.lock.parseHash();
    this.handleHash(this.hash, this.props.hashHandler);
  }

  handleHash(hash, handlerFn) {
    if (hash) {
      if (hash.error) {
        throw Error (`There was an error logging in: ${hash.error}`);
      } else {
        this.lock.getProfile(hash.id_token, handlerFn);
      }
    }
  }

  getLock() {
    return this.lock;
  }

  showLock(cb){
    if(this.props.popup){
        if (typeof cb !== 'function') throw Error("Callback must be a function");
        this.lock.show(this.props, cb);
    } else {
      this.lock.show(this.props);
    }
  }

  render () {
    const container = this.props.container;
    if(container){
      return (
        <div id={container}></div>
      );
    }
    return false;
  }
}

Lock.propTypes = {
  domain: PropTypes.string.isRequired,
  clientID: PropTypes.string,
  clientId: PropTypes.string
};

export default Lock;
