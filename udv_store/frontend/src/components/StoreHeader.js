import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import StoreIcon from '../svgs/StoreIcon'
import UcoinIcon from '../svgs/UcoinIcon'

const StoreHeader = () => {
  let {user, logoutUser, userBalance} = useContext(AuthContext)

  return (
    <div className="header">
      <div className='logo'>
        <Link to="/store">
          <StoreIcon className="header-logo" />
        </Link> 
        <ul>
          { user !== null && user["role"] !== "EE" ?
                <li>
                  <Link to="/admin/main" className='admin-panel-link'>Admin-panel</Link>
                </li> : <></>}
        </ul>
      </div>
      <div className='menu'>
        <ul>
          { user !== null ?
            <>
              <li>
                <span className='menu-item'>
                  <span onClick={logoutUser} className="logout">Logout</span>
                </span>
              </li> 
            </>:
            <li><Link to="/login" className='menu-item'>Login</Link></li>}
            <li><Link to="/personal" className='menu-item'>
                  {userBalance["balance"]? <><b>{userBalance["balance"]}</b>
                  <UcoinIcon width={20} height={20} /></> : <></>}
                  My Page</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default StoreHeader