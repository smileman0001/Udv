import React, { useContext, useState, useEffect } from 'react'

import AuthContext from '../../context/AuthContext'
import Manage from '../../components/personalPage/Manage'
import Banner from '../../components/personalPage/Banner'
import UserInfo from '../../components/personalPage/UserInfo'

import "../../css/PersonalPage.css"


const PersonalPage = () => {
  let {user, authTokens, logoutUser, updateUserBalance} = useContext(AuthContext)

  useEffect(() => {
    updateUserBalance()
  }, [])

  return (
    <div className='container'>
      <Banner />
      <UserInfo />
      <Manage />
    </div>
  )
}

export default PersonalPage;