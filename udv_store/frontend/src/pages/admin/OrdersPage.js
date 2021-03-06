import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import "../../css/OrdersPage.css"

const RequestsPage = () => {
    let {user} = useContext(AuthContext)
    let [ordersList, setOrdersList] = useState(null)
    let navigate = useNavigate()

    useEffect( () => {
        console.log("Load orders list")
        getOrderList()
    }, [])

    let getOrderList =  () => {
        console.log("Load!")
        let url = "http://localhost:8000/api/orders/"
        axios({
            method: "GET",
            url: url, 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => setOrdersList(response.data))
        .catch(err => console.log("ERROR: ", err))
    }

    return (
        <div className='container'>
            <div className="orders-wrapper">
                {ordersList ? <>
                    {ordersList.map(order => {
                        if (order["user_id"] !== user.user_id) {
                            return (
                                <div className="orders-item">
                                    <div className='order-link' onClick={() => navigate("/admin/orders/" + String(order["id"]))}>ORDER #{order["id"]}</div>
                                    <p>Date: {order["created_date"]}</p>
                                </div>
                            )
                        } else {
                            return (<></>)
                        }    
                    })}
                </> : <>
                
                </>}
            </div>
        </div>
    )
}

export default RequestsPage