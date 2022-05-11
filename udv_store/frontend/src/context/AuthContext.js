import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const AuthContext = createContext()


export default AuthContext


export const AuthProvider = ({children}) => {

  let navigate = useNavigate()

  let [authTokens, setAuthTokens] = useState(
    localStorage.getItem('AuthTokens') ? JSON.parse(localStorage.getItem('AuthTokens')) : null
  )
  let [user, setUser] = useState(
    localStorage.getItem('AuthTokens') ? jwt_decode(localStorage.getItem('AuthTokens')) : null
  )
  let [userBalance, setUserBalance] = useState(
    localStorage.getItem('UserBalance') ? JSON.parse(localStorage.getItem("UserBalance")) : 10
  )

  let [loading, setLoading] = useState(true)
    
  let loginUser = async (e) => {
    e.preventDefault()
    let url = "http://127.0.0.1:8000/api/token/"
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-type': "application/json",
      },
      body: JSON.stringify({
        "username": e.target.user_login.value,
        "password": e.target.user_password.value,
      }),
    });
    let data = await response.json()

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem('AuthTokens', JSON.stringify(data))
      navigate("/personal")
    } else {
      alert("Something went wrong!")
    }
  }

  let logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('AuthTokens')
    localStorage.removeItem('UserBalance')
    navigate("/login")
  }

  let updateToken = async () => {
    let url = "http://127.0.0.1:8000/api/token/refresh/"
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "refresh": authTokens.refresh
      })
    })
    let data = await response.json()

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem('AuthTokens', JSON.stringify(data))
    } else {
      logoutUser()
    }
  }

  let updateUserBalance = async () => {
    let url = "http://127.0.0.1:8000/api/user-balance/"
    let response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': "application/json",
        "Authorization": "Bearer " + String(authTokens.access)
      }
    })
    let data = await response.json()

    if (response.status === 200) {
      setUserBalance(data)
      localStorage.setItem("UserBalance", JSON.stringify(data))
    } else {
      logoutUser()
    }
  }

  let contextData = {
    user: user,
    userBalance: userBalance,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    updateUserBalance: updateUserBalance,
  }

  useEffect(() => {
    let twentyNineMinutes = 1000 * 60 * 29
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken()
      }
    }, twentyNineMinutes)
    return () => clearInterval(interval)
  }, [authTokens, loading])

  useEffect(() => {
    let oneMinute = 1000 * 60
    let interval = setInterval(() => {
      if (authTokens) {
        updateUserBalance()
      }
    }, oneMinute)
    return () => clearInterval(interval)
  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}