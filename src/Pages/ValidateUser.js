import React from 'react';
import axios from 'axios';
import LoginPage from '../Pages/LoginPage';
import InnerApp from '../Pages/InnerApp';

class ValidateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          openApp: false,
          email: '',
        //   password: '',
          RoleDescription: '',
          RoleId: '',
          FirstName: '',
          LandingPage: ''
        };

        console.log('after constructor');
    }

    async checkUserInDB() {
        console.log('In checkUserInDB');
        let header = {
          "Content-Type": "application/json",
          opnfor: "LoginCheck",
          transaction: this.props.email
        }
      
        axios
          .get("https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations",
              { headers: header })
          .then(function(response) {
            console.log(response);  
            if(response.data.msg){
              // User not found
              return <LoginPage />
            }else{
              // User found
              this.setState(
                {
                    openApp: true,
                    email: this.props.email,
                    RoleDescription: response.data.body.Role,
                    RoleId: response.data.body.RoleID,
                    FirstName: response.data.body.UserName,
                    LandingPage: response.data.body.LandingPage
                }
              );
              return <InnerApp />
            }
          })
          .catch(function(error) {
            return <LoginPage />;
          });
        console.log('After axios');  
    }

    render() {
        console.log('In rendor');
        return this.checkUserInDB();
    }
}

export default ValidateUser;