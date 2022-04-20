import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import "../css/Header.css"
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div className="flex-wrapper">
        <Link className="flex-item" to="/store">Store</Link> {"|"}
        <Link className="flex-item" to="/personal">My Page</Link> {"|"}
        { user !== null ?
          <span className="flex-item" >
            <strong>Balance: {user.balance} </strong>
            <i>Role: {user.role} </i>
            <span onClick={logoutUser} className="logout">Logout</span>
          </span>:
          <Link className="flex-item" to="/login">Login</Link> }
    </div>
  )
}

export default Header