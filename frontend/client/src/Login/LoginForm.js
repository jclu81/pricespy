import React from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css';

const LoginForm = ({
                       onSubmit,
                       onChange,
                       errors,
                       users,
                   }) => (
    <div className="cloud-box login-box">
        <form className="form-horizontal" action="/" onSubmit={onSubmit}>
            <h4 className="title">Login</h4>
            {errors.summary && <div className="row"><p className="error-message">{errors.summary}</p></div>}

            <div className="form-group">
                <div className="col-sm-12">
                    <input className="form-control" id="email" type="email" name="email" placeholder="E-mail"
                           onChange={onChange}/>
                </div>
            </div>
            {errors.email && <div className="row"><p className="error-message">{errors.email}</p></div>}
            <div className="form-group">
                <div className="col-sm-12">
                    <input className="form-control" id="password" type="password" name="password" placeholder="Password"
                           onChange={onChange}/>
                </div>
            </div>
            {errors.password && <div className="row"><p className="error-message">{errors.password}</p></div>}
            <div className="form-group">
                <div className="col-sm-12">
                    <input type="submit" className="btn btn-medium btn-block btn-primary" value='Log in'/>
                </div>
            </div>
        </form>
    </div>
);

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default LoginForm;
