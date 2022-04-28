import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import StoreIcon from '../svgs/StoreIcon'

const AdminHeader = () => {
  let {authTokens} = useContext(AuthContext)
  let [userInfo, setUserInfo] = useState()

  useEffect(() => {
    getUserInfo()
  }, [])
  

  let getUserInfo = async () => {
    let url = "http://localhost:8000/api/userinfo/"
    axios({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(authTokens.access)
      }
    })
    .then(response => setUserInfo(response.data))
    .catch(err => console.log("Error: ", err))
  }

  return (
    <>
        {userInfo ? <div className='header'>
          <div className='logo'>
            <Link to="/store">
              <StoreIcon />
            </Link>
            <ul>
              <li>
                <Link to="/admin/main" className='admin-panel-link'>
                  Admin-panel 
                </Link>
              </li>
            </ul>
          </div>
          <div className='menu'>
            <ul>
              <li><span>{userInfo["first_name"] + " " + userInfo["last_name"]}</span></li>
            </ul>
          </div>
        </div> : <> </>}
    </>
  )
}

export default AdminHeader