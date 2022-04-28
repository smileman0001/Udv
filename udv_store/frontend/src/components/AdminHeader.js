import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

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
        {userInfo ? <>
          <Link className='flex-item' to="/admin/main">Admin Panel</Link>{"|"}
          <Link className='flex-item' to="/store">Back to Store</Link>{"|"}
          <span className="flex-item">{userInfo["first_name"] + " " + userInfo["last_name"]}</span>
        </> : <> </>}
    </>
  )
}

export default AdminHeader