import React, { Component } from "react";

import axios from 'axios';
import store from 'store';
import { AuthConsumer } from './AuthContext';
import { Redirect } from 'react-router-dom';
import Auth from './modules/Auth';
import ReactEncrypt from 'react-encrypt';
import PropTypes from 'prop-types';


class Login extends Component {

  static contextTypes = {
    encrypt: PropTypes.func.isRequired,
    decrypt: PropTypes.func.isRequired,
  }


  state = {
    username: '',
    password: '',
    errorMessage: ''
  }




  handleusernameChange = event => { this.setState({ username: event.target.value }); }
  handlepasswordChange = event => { this.setState({ password: event.target.value }); }



  handleSubmit = event => {
    event.preventDefault();



    const headers = {
      'Content-Type': 'application/json',
      'Authkey': Auth.Authkey()
    }


    axios.post(`${Auth.getapiurl()}/login`,
      {
        username: this.state.username,
        password: this.state.password
      },
      {
        headers: headers
      }).then(res => {



        if (res.data.status == 0) {
          Auth.toastmsg(res.data.message, 'E')

          //this.setState({ errorMessage: res.data.message});

        } else {
          //localStorage.setItem('id_token', res.data.session);
          Auth.toastmsg(res.data.message, 'S')
          store.set('id_token', res.data.responsedata.session);
          store.set('userdata', JSON.stringify(res.data.responsedata.userdata));
          window.location.href = Auth.getSiteUrl() + '/';



        }



      })
      .catch(error => {
        return { errorMessage: error };

      });
  }

  renderAlert() {

    if (this.state.errorMessage) {

      return (
        <div className="alert alert-danger">
          <strong>!Opps, </strong>{this.state.errorMessage}
        </div>
      );
    }
  }

  render() {

    if (store.get('id_token')) {
      return <Redirect to="/" />;
    }


    return (
      <div>


        <div className="page vertical-align text-center" data-animsition-in="fade-in" data-animsition-out="fade-out">
          <div className="page-content vertical-align-middle animation-slide-top animation-duration-1">
            <div className="panel">
              <div className="panel-body">
                <div className="brand">
                  <img className="brand-img" src={Auth.imageCheck('img/logo.png')} alt="..." />
                    <h2 className="brand-text font-size-18">Remark</h2>
                </div>
                <form method="post" action="#">
                  <div className="form-group form-material floating" data-plugin="formMaterial">
                    <input type="email" className="form-control" name="email" />
                    <label className="floating-label">Email</label>
                  </div>
                  <div className="form-group form-material floating" data-plugin="formMaterial">
                    <input type="password" className="form-control" name="password" />
                    <label className="floating-label">Password</label>
                  </div>
                  <div className="form-group clearfix">
                    <div className="checkbox-custom checkbox-inline checkbox-primary checkbox-lg float-left">
                      <input type="checkbox" id="inputCheckbox" name="remember" />
                        <label for="inputCheckbox">Remember me</label>
                    </div>
                    <a className="float-right" href="forgot-password.html">Forgot password?</a>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg mt-40">Sign in</button>
                </form>
                <p>Still no account? Please go to <a href="register-v3.html">Sign up</a></p>
              </div>
            </div>

            <footer className="page-copyright page-copyright-inverse">
              <p>WEBSITE BY Creation Studio</p>
              <p>© 2018. All RIGHT RESERVED.</p>
              <div className="social">
                <a className="btn btn-icon btn-pure" href="javascript:void(0)">
                  <i className="icon bd-twitter" aria-hidden="true"></i>
                </a>
                <a className="btn btn-icon btn-pure" href="javascript:void(0)">
                  <i className="icon bd-facebook" aria-hidden="true"></i>
                </a>
                <a className="btn btn-icon btn-pure" href="javascript:void(0)">
                  <i className="icon bd-google-plus" aria-hidden="true"></i>
                </a>
              </div>
            </footer>
          </div>
        </div>


        {/* 
        {this.renderAlert()}
        <AuthConsumer>
          {({ login }) => (
            <div className="login-box">

              <div className="login-logo">

                <img src={Auth.imageCheck('img/logo.png')} />



              </div><div className="login-box-body">
                <p className="login-box-msg">Sign in to start your session</p>
                <form onSubmit={this.handleSubmit} className="form-horizontal">

                  <div className="form-group">
                    <input type="text" className="form-control" required id="username" name="username" onChange={this.handleusernameChange} placeholder="Email" />
                  </div>


                  <div className="form-group">
                    <input type="password" className="form-control" required id="password" name="password" onChange={this.handlepasswordChange} placeholder="Password" />
                  </div>


                  <div className="text-center">
                    <button type="submit" className="btn btn-primary" onClick={login}>Login</button>
                  </div>



                </form>

              </div>
            </div>


          )}
        </AuthConsumer> */}

      </div>
    );
  }
}

export default Login;