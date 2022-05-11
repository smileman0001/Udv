import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext'

import UcoinIcon from "../../svgs/UcoinIcon"

const UserInfo = () => {
    const {logoutUser, authTokens} = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(null)

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
    .then(response => {
        if (response.status === 200) {
            setUserInfo(response.data)
          } else if (response.status === 401 ) {
            logoutUser()
        }
    })
    .catch(err => console.log("ERROR: ", err))
  }

    return (
        <div className='userinfo-wrapper'>
            { userInfo ? <>
                <p className='user-position'>{userInfo.position}</p>
                <p className='user-name'>{String(userInfo.first_name + " " + userInfo.last_name)}</p>
                <p className='user-balance'>{userInfo.balance}<UcoinIcon width={20} height={20} /></p>

            </> : <p>No info</p>}
        </div>
    )
}

export default UserInfo