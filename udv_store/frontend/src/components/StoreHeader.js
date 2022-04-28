import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import StoreIcon from '../svgs/StoreIcon'

const StoreHeader = () => {
  let {user, logoutUser, userBalance} = useContext(AuthContext)

  return (
    <div className="store-header">
      <div className='logo'>
        <Link to="/store">
          <StoreIcon className="header-logo" />
        </Link> 
      </div>
      <div className='menu'>
        <ul>
          <li><Link to="/personal">My Page</Link></li>
          { user !== null ?
            <>
              {user["role"] !== "EE" ? 
              <li>
                <Link to="/admin/main">Admin panel</Link>
              </li> : <></>}
              <li >
                <b>UB: {userBalance["balance"]}</b>{"~~"}
                <span onClick={logoutUser} className="logout">Logout</span>
              </li> 
            </>:
            <li><Link to="/login">Login</Link></li>}
        </ul>
      </div>
    </div>
  )
}

export default StoreHeader