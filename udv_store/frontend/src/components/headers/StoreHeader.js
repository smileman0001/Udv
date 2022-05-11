import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import AuthContext from '../../context/AuthContext'
import StoreIcon from '../../svgs/StoreIcon'
import UcoinIcon from '../../svgs/UcoinIcon'

import "../../css/componentStyle/Cart.css"

const StoreHeader = () => {
  let {user, logoutUser, userBalance} = useContext(AuthContext)

  return (
    <>
    <div className='header'>
      <div className='logo'>
        <Link to="/store">
          <StoreIcon className="header-logo" />
        </Link> 
          { user !== null && user["role"] !== "EE" ?
                  <div className='admin-panel-btn deactive'>
                    <Link to="/admin/main" className='admin-panel-link'>Admin-panel</Link>
                  </div>
                : <></>}
      </div>
      <div className='menu'>
        <ul>
          <li>
            {user ?<Link to="#" className='menu-item logout' onClick={logoutUser}>Logout</Link> : <></>}
          </li>
          <li>
            <Link to="/personal" className='menu-item'>
              {userBalance["balance"]? <><b>{userBalance["balance"]}</b>
              <UcoinIcon width={20} height={20} /></> : <></>}
              My Page
            </Link>
          </li>
        </ul>
      </div>
    </div>
    </>
  )
}

export default StoreHeader