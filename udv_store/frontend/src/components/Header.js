import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import StoreHeader from './StoreHeader'
import "../css/Header.css"


const Header = () => {
  let [checkAdmin, setCheckAdmin] = useState(false)
  let location = useLocation()


  useEffect( () => {
    setCheckAdmin(location.pathname.split("/").includes("admin"))
  }, [location])


  return (
    <>
        { checkAdmin ? <>
        <AdminHeader />
        </> : <> 
        <StoreHeader />
        </> }
    </>
  )
}

export default Header