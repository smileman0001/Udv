import {Navigate, Outlet} from 'react-router-dom'
import { useContext } from 'react'

import AuthContext from '../context/AuthContext'


const useAuth = () => {
    let {user} = useContext(AuthContext)

    return user !== null
}


const ProtectedRoutes = () => {
    const isAuth = useAuth()
    return isAuth ? <Outlet /> : <Navigate to="/login" />
};


export default ProtectedRoutes;