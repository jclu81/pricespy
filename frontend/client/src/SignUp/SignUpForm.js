import React from 'react';
import PropTypes from 'prop-types';
import './SignUpForm.css';

const SignUpForm = ({
                        onSubmit,
                        onChange,
                        errors,
                        user,
                    }) => (

    <div className="cloud-box login-box">
        <form className="form-horizontal" action="/" onSubmit={onSubmit}>
            <h4 className="title">
                Create an account
            </h4>

            {errors.summary && <div className="row"><p className="error-message">{errors.summary}</p></div>}
            <div className="form-group">
                <div className="col-sm-12">
                    <input id="email" type="email" name="email" placeholder="E-mail" className="form-control" onChange={onChange}/>
                </div>
            </div>
            {errors.email && <div className="row"><p className="error-message">{errors.email}</p></div>}
            <div className="form-group">
                <div className="col-sm-12">
                    <input id="password" type="password" name="password" placeholder="Password" className="form-control" onChange={onChange}/>
                </div>
            </div>
            {errors.password && <div className="row"><p className="error-message">{errors.password}</p></div>}
            <div className="form-group">
                <div className="col-sm-12">
                    <input id="confirm_password" type="password" name="confirm_password" placeholder="Confirm Password" className="form-control"
                           onChange={onChange}/>
                </div>
            </div>
            <div className="row right-align">
                <input type="submit" className="btn btn-medium btn-block btn-success" value='Sign Up'/>
            </div>
        </form>
    </div>

);

SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default SignUpForm;
