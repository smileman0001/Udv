import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import "../css/OrderPage.css"

const OrderPage = () => {
    let {orderId} = useParams()
    let [orderInfo, setOrderInfo] = useState(null)
    let navigate = useNavigate()

    useEffect( () => {
        getOrderInfo()
    }, [])

    let getOrderInfo = async () => {
        let url = "http://localhost:8000/api/orders/" + String(orderId) + "/"
        axios({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.status == 200) {
                setOrderInfo(response.data)
            } else {
                navigate("/admin/orders")
            }
        })
        .catch(err => console.log("ERROR: ", err))
    }

    let completeOrder = async () => {
        let url = "http://localhost:8000/api/orders/" + String(orderId) + "/"
        axios({
            method: "DELETE",
            url: url,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => navigate("/admin/orders"))
        .catch(err => console.log("ERROR: ", err))

        
    }

    return (
        <div className='container'>
            <h4>Order #{orderId}</h4>
            {orderInfo ? <>
                <div className='user-info'>
                    <p>UserId: #{orderInfo["user_id"]}</p>
                    <p>{orderInfo["user_name"]}</p>
                </div>
                <div className='products-wrapper'>
                    {orderInfo["products_list"].map(product => (
                        <div className='products-item'>
                            <p>Product: {product["product_name"]}</p>
                            <p>Photo: {product["product_photo"]}</p>
                            <p>Count: {product["count"]}</p>
                        </div>
                    ))}
                </div>
                {orderInfo["office_address"] == "LA" ? <> 
                    <p>Office: ул. Ленина, 45а</p>
                </> : 
                <> 
                    {orderInfo["office_address"] == "MA" ? <>
                        <p>Office: ул. Мира, 32</p>
                    </> : <> 
                        <p>Office: ул. Ясная, 12</p>
                    </>}
                </>}
                <input className="complete-order-btn" type="button" value="Completed!" onClick={completeOrder} />
            </> : <> </>}
        </div>
    )
}

export default OrderPage