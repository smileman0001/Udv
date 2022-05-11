import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const RequestHistory = props => {
    const {authTokens} = useContext(AuthContext)
    const [requestHistory, setRequestHistory] = useState(null)

    useEffect(() => {
        getRequestHistory()
    }, [])

    const getRequestHistory = async () => {
        let url ="http://localhost:8000/api/userhistory/request/full/"
        axios({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        .then(response => setRequestHistory(response.data))
        .catch(err => console.log("ERROR: ", err))
    }

    return (
        <div className='popup-box'>
            <div className='box'>        
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <h4>Requests history</h4>
                {requestHistory ? 
                <div className="">
                    {requestHistory.map(request => (
                        <div style={{border: "1px dotted pink"}}>
                            <p><Link to='$'>Request #{request.request_id}</Link></p> <br /> State is {request.state}
                        </div>
                    ))}
                </div> : <p>List is Empty</p>}      
            </div>
        </div>
    )
}

export default RequestHistory