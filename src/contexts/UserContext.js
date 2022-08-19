
import { createContext, useState, useEffect } from 'react'
//Amplify package
import { Auth, Hub } from 'aws-amplify'
import axios from 'axios'

export const UserContext = createContext()
export const UserContextProvider = (props) => {
  // const [user, setUser] = useState(null)
  const [user, setUser] = useState({
    openApp: false,
    email: 'NOT-SET'
  })
  const [progressCircle, setProgressCircle] = useState(false)
  Hub.listen('auth', (data) => {
    switch (data.payload.event) {
      case 'signOut':
        setUser(null)
        break
      case 'cognitoHostedUI':
        // console.log('cognitoHostedUI', data)
        break
      default:
        break
    }
  })
  
  // let loggedInUserData = {
  //   openApp: false,
  //   email: 'NOT-SET'
  // }

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        // case 'cognitoHostedUI':
          checkUser();
          break
        case 'signOut':
          setUser(null)
          break
        case 'signIn_failure':
          case 'cognitoHostedUI_failure':
            console.log('Sign in failure', data);
            break;
        default:
          break
      }
    })
    // checkUser()
  })

  // const checkUser = async () => {
  //   try {
  //     // const responseUser = await Auth.currentAuthenticatedUser()

  //        setUser(responseUser)
  //        setProgressCircle(false)
  //   } catch (error) {
  //     setUser(null)
  //     setProgressCircle(false)
  //   }
  // }

  const checkUser = async () => {
    const handlePromise = async () =>{
      const response = await Auth.currentAuthenticatedUser();
      const email = response.signInUserSession.idToken.payload.email;

      setUser({
        openApp: false,
        email: email
      })

      // User EmailID received
      isUserAuthorized(email);
    }
    handlePromise();
  }

  const isUserAuthorized = async (email) =>{
    let e = email;
    const handlePromise = async () =>{
      let header = {
        "Content-Type": "application/json",
        opnfor: "LoginCheck",
        transaction: e
      }
    
      const response = await axios
        .get("https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations",
            { headers: header });

      const userData= response;

      if(userData.data.msg !== ''){
        // User not found
        
        setUser({
          openApp: false,
          msg: userData.data.msg,
          email: ''
        });
        Auth.signOut();
        
        return false;
      }else{
        // User found
        setUser({
          openApp: true,
          email: e,
          RoleDescription: userData.data.body.Role,
          UserName: userData.data.body.UN,
          FirstName: userData.data.body.UserName,
          LandingPage: userData.data.body.LandingPage
        });

        return true;
      }
    }
    handlePromise();
  }

  return (
    <>
      {progressCircle ? (
        'Loading'
      ) : (
        <UserContext.Provider value={{ user, setUser }}>
          {props.children}
        </UserContext.Provider>
      )}
    </>
  )
}