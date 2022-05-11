import axios from 'axios';
import React, { useState } from 'react'

import TestPage from './TestPage';

const TestPage1 = () => {
    const [usersList, setUsersList] = useState([])

    const getUsersList = (e) => {
        e.preventDefault()
        if (e.target.value.length == 0) {
            console.log("Empry string");
            setUsersList([]);
        } else {
            console.log(e.target.value)
            let url = "http://localhost:8000/api/search-user/" + e.target.value + "/"
            axios({
                method: "GET",
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setUsersList(response.data))
            .catch(err => console.log("ERROR: ", err));
        };
    }

    return(
        <div className='container'>
            <h4>User Search</h4>
            <input type="text" placeholder='Enter characters' onChange={(e) => getUsersList(e)} />
            <div style={{background: 'lightblue'}}>
                { usersList && usersList.length > 0 ? <>
                    {usersList.map(user => (
                        <div style={{border: "1px dotted black", margin: "10px", padding: "10px"}}>
                            <p><a>{user.first_name}</a></p>
                            <p>{user.last_name}</p>
                            <p>{user.position}</p>
                        </div>
                    ))}
                </> : <>
                    Пока нет результатов      
                </>
                }
            </div>
        </div>
    )
}

export default TestPage1