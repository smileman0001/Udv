import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const OrderHistory = props => {
    const {authTokens} = useContext(AuthContext)
    const [orderHistory, setOrderHistory] = useState(null)

    useEffect(() => {
        getOrderHistory()
    }, [])

    const getOrderHistory = async () => {
        let url ="http://localhost:8000/api/userhistory/request/full/"
        axios({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        .then(response => setOrderHistory(response.data))
        .catch(err => console.log("ERROR: ", err))
    }
    return (
      <div className='popup-box'>
          <div className='box'>        
              <span className="close-icon" onClick={props.handleClose}>x</span>
              <h4>Orders history</h4>
                {orderHistory ? 
                <div className="">
                    {orderHistory.map(order => (
                        <div style={{border: "1px dotted pink"}}>
                            <p><Link to='$'>Request #{order.id}</Link></p> <br /> State is {order.state}
                        </div>
                    ))}
                </div> : <p>List is Empty</p>}  
          </div>
      </div>
    )
  }

export default OrderHistory