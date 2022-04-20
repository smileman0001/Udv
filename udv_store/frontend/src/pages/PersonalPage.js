import React, { useContext, useState, useEffect } from 'react'
import "../css/PersonalPage.css"
import AuthContext from '../context/AuthContext'


const PersonalPage = () => {
  let {user, authTokens, logoutUser} = useContext(AuthContext)
  let [userInfo, setUserInfo] = useState({})
  let [activities, setActivities] = useState([])
  let [comment, setComment] = useState("InitialText")

  useEffect(() => {
    getUserInfo()
  }, [])

  let getUserInfo = async () => {
    console.log("Fetching user info")
    let url = "http://localhost:8000/api/userinfo/"
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + String(authTokens.access)
      },
    })
    let data = await response.json()

    if (response.status === 200) {
      setUserInfo(userInfo = data)
    } else if (response.status === 401 ) {
      logoutUser()
    } else {
      alert("Something went wrong!")
    }
    getActivitiesList()
  }

  let getActivitiesList = async () => {
    let url = "http://localhost:8000/api/activities/"
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    let data = await response.json()

    if (response.status == 200) {
      setActivities(activities = data)
    }

    console.log(activities)
  }

  let createNewRequest = async (e) => {
    e.preventDefault()
    let url = "http://localhost:8000/api/create-request/"
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.user_id,
        activity_id: e.target.activity_id.value,
        comment: e.target.comment_area.value,
        created_date: Date.now()
      })
    })
    setComment("")
  }

  return (
    <>
      <h2 className='center-text'>Personal Page</h2>
      <div className="flex-wrapper">
        <div className='column'>
          <h3>Card</h3>
          <img src="" alt="*Here personal image*" />
          <p>Your position: <strong>{userInfo.position}</strong></p>
          <p>{String(userInfo.first_name + " " + userInfo.last_name)}</p>
          <p>Your balance: <strong>{userInfo.balance}</strong> </p>
        </div>
        <div className='column'>
          <h3>User information</h3>
          <p>Phone: <strong>{userInfo.phone_number}</strong></p>
          <p>Email: <strong>{userInfo.email}</strong></p>
          <p>About me: <strong>{userInfo.about_me}</strong></p>
        </div>
      </div>

      <div className='request-section'>
        <div className='form-wrapper'>
          <h4>Запрос на пополнение</h4>
          <form onSubmit={createNewRequest}>
            <select name="activity_id">
              {activities.map(activity => (
                <option value={activity.activity_id}>
                  {activity.name}
                </option>
              ))}
            </select>
            <br />
            <textarea name="comment_area" placeholder="Enter you comment" maxLength="250"
            rows={5} cols={40} value={comment} onChange={(e) => {
              e.preventDefault()
              setComment(e.target.comment_area)
              }} /> <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </>
  )
}

export default PersonalPage;