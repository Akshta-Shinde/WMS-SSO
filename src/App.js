
import { useContext } from 'react'
//Context
import { UserContext } from './contexts/UserContext'
//Pages
import LoginPage from './Pages/LoginPage'
import InnerApp from './Pages/InnerApp'
import LandingPage from './Pages/LandingPage'

import './style.css'

function App() {
  const { user } = useContext(UserContext)

  if(user){
    if (user.openApp) {
      return <LandingPage data={user} />
    }else{
      return(
        <>
          <LoginPage />
          <UserPrompt  user={user} />
        </>
      )
    }
  }else {
    return(
      <>
        <LoginPage />
        <p class="loginMsg">
          Please login using Google or credentials provided to you
        </p>
      </>
    )
  }
}

function UserPrompt({user}){
  let err = user.email;

  if( err === "NOT-SET"){
    return (
      <>
        <p class="loginMsg">
          Please login using Google or credentials provided to you
        </p>
      </>
    )
  }else{
    return (
      <>
        <p class="loginError">
          Sorry! You are not authorized to use this application
        </p>
      </>
    )
  }
}

export default App