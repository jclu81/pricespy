
import React from 'react';
import ReactDOM from 'react-dom';
import Lock from '../components/lock.component';

let div = document.createElement('div');

document.body.appendChild(div);

class Login extends React.Component {

    componentDidMount() {
        this.lock = this.refs.lock1.getLock();
    }

    showLock(){
        this.refs.lock1.showLock(function(err, profile){
            if(err) console.log(err);
            console.log(profile);
        });
    }

    hashHandler(err, profile){
        if(err) console.log(err);
        console.log(`:) ${profile}`)
    }

    render() {
        return (
            <div>
                <Lock
                    clientID='C03OBi5IrOZgr70UZeAqFE3bwFYrmfdB'
                    domain='pricespy.auth0.com'
                    ref={"lock1"}
                    connections={['google-oauth2', 'facebook']}
                    socialBigButtons={false}
                    hashHandler={this.hashHandler}
                />
                <button onClick={this.showLock.bind(this)}>Show</button>
            </div>
        );
    }
}

ReactDOM.render(<Login />, div);