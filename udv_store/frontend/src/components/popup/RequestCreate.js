import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext'

const RequestCreate = props => {
    const {user} = useContext(AuthContext)
    let [activities, setActivities] = useState([])
    let [comment, setComment] = useState("InitialText")
    
    useEffect(() => {
        getActivitiesList()
    }, [])

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
    }

    let createNewRequest = async (e) => {
        e.preventDefault()
        let url = "http://localhost:8000/api/create-request/"
        await fetch(url, {
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
        await props.handleClose()
    }

    return (
        <div className='popup-box'>
            <div className='box'>        
                <span className="close-icon" onClick={props.handleClose}>x</span>
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
        </div>
    )
}

export default RequestCreate