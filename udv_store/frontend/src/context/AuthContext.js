import { createContext, useContext, useEffect, useState } from 'react'
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
  let [loading, setLoading] = useState(true)


  let loginUser = async (e) => {
    e.preventDefault()
    console.log("Fetching token")
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
    navigate("/login")
  }

  let updateToken = async () => {
    let url = "http://127.0.0.1:8000/api/token/refresh"
    let response = fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "refresh": authTokens.refresh
      })
    })
    let data = response.json()

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data))
      localStorage.setItem('AuthTokens', JSON.stringify(data))
    } else {
      logoutUser()
    }
  }

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  }

  useEffect(() => {
    let nineMinutes = 1000 * 60 * 9
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken()
      }
    }, nineMinutes)
    return () => clearInterval(interval)
  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}