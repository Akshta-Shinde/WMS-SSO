import React from 'react';
import { Auth } from 'aws-amplify';
import logoImg from './../loginLogo1.jpg';

import '../style.css';

function CognitoSignIn(){
    <div class="app-container body-tabs-shadow fixed-sidebar fixed-header">

      <div class="container login-container">
          <div class="row">
              <div class="col-md-6 login-form-1">
                  <img src={logoImg} class="img img-responsive" alt="" />
                  <div class="row">
                      <div class="col-md-3 evole-txt">Evolve. </div>
                      <div class="col-md-3 enable-txt">Enable. </div>
                      <div class="col-md-3 empower-txt">Empower</div>
                  </div>   
              </div>

              <div class="col-md-6 login-form-2">

                  <div class="logoImg">
                      <img src="https://emizainc.com//wp-content/uploads/2020/10/Emiza-1-color-White@4x.svg" class="img img-responsive" alt="" />
                  </div>

                  <form id="registrationForm" onSubmit={(e) => this.onSubmitForm(e)}>
                      <input type="text" placeholder="Email" />
                      <input type="password" placeholder="Password" />
                      <input type="submit" class="btnSubmit" value="SignIn"/>
                  </form>
              </div>
          </div>
      </div>
  </div>
}
  
export default CognitoSignIn;