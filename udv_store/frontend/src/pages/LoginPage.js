import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import "../css/LoginPage.css"

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
  return (
    <>
      <div className="main-wrapper">
        <p>Login Page</p>
        <form onSubmit={loginUser}>
          <input type="text" name="user_login" placeholder="Enter login" />
          <br />
          <input type="password" name="user_password" placeholder="Enter password" />
          <br />
          <input type="submit" value="Login" className='submit-button'/>
        </form>
      </div>
    </>
  )
}

export default LoginPage