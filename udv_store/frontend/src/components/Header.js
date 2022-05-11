import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminHeader from './headers/AdminHeader'
import StoreHeader from './headers/StoreHeader'
import LoginHeader from './headers/LoginHeader'
import "../css/componentStyle/Header.css"


const Header = () => {
  let [checkAdmin, setCheckAdmin] = useState(false)
  let location = useLocation()

  useEffect( () => {
    setCheckAdmin(location.pathname.split("/").includes("admin"))
  }, [location])

  return (
    <div className='header-wrapper'>
        {location.pathname.split("/").includes("login") ? 
        <LoginHeader /> :
        <>
          { checkAdmin ? <>
          <AdminHeader />
          </> : <> 
          <StoreHeader />
          </> } 
        </>}
    </div>
  )
}

export default Header