
import { Auth } from 'aws-amplify'
import React from 'react';

import '../login.css';
import logoImg from '../logo.png';
import googleLogin from '../google-signin-button.png';

class LoginPage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        stage: 0,
        email: '',
        password: '',
        userObject: null
      };
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPasswordChanged(e) {
      this.setState({ password: e.target.value });
  }

  async cSignIn(e) {
    e.preventDefault();
    try {
        const userObject = await Auth.signIn(
            // this.state.email.replace(/[@.]/g, '|'),
            this.state.email,
            this.state.password
        );
        // console.log('userObject', userObject);
        // console.log("Email: " , userObject.signInUserSession.idToken.payload.email);
        if (userObject.challengeName) {
            // Auth challenges are pending prior to token issuance
            this.setState({ userObject, stage: 1 });
        } else {
            // No remaining auth challenges need to be satisfied
            const session = await Auth.currentSession();
            this.setState({ stage: 0, email: '', password: '', code: '' });
            // this.props.history.replace('/app');
        }
    } catch (err) {
        alert(err.message);
        console.error('Auth.signIn(): ', err);
    }
  }

  async googleSignIn(){
    try{
      await Auth.federatedSignIn({ provider: 'Google' });
    }catch (err) {
        alert(err.message);
        console.error('Auth.federatedSignIn: ', err);
    }
  }

  isError(){

  }

  CognitoSignIn() {
    // const isValidEmail = this.isValidEmail(this.state.email);
    // const isValidPassword = this.state.password.length > 1;

    return(
      <div className="form">
      <form className="lForm">
        <div className="imgDiv">
          <img className="logImg" src={logoImg} alt="" />
        </div>
        <div className="input-container">
          <label>Username </label>
          <input type="email" name="email" placeholder="Email Address"
              value={this.state.email} onChange={(e) => this.onEmailChanged(e)} required autoFocus />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" placeholder="Password"
              name="password" value={this.state.password} onChange={(e) => this.onPasswordChanged(e)} required />
        </div>
        <div className="button-container">
          {/* <input type="submit" /> */}
          <button class="login-btn" onClick={(e) => this.cSignIn(e)}>Sign in with Credentials</button>
        </div>
        <div className="button-container">
          <button class="google-login-btn" onClick={() => this.googleSignIn()}><img className="googleLoginImg" src={googleLogin} alt="" /></button>
        </div>
      </form>
    </div>
    );
  }

  render() {
    return this.CognitoSignIn();
  }
}

export default LoginPage;