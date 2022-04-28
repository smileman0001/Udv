import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ConfirmPage = () => {
    let navigate = useNavigate()
    let {authTokens, updateUserBalance} = useContext(AuthContext)
    let [accepted, setAccepted] = useState(false)
    let [order, setOrder] = useState(null)

    useEffect(() => {
        console.log("Accepted: ", accepted)
    }, [accepted])

    let createOrder = async (e) => {
        e.preventDefault()

        const createOrderDB = async (office) => {
            let url = "http://localhost:8000/api/get-orders/"
            
            axios({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                },
                data: JSON.stringify({
                    "office_address": office
                })
            })
            .then(response => {
                if (response.status === 200) {
                    setOrder(response.data)    
                    updateUserBalance()
                }
            })
            .catch(err => console.log("ERROR: ", err))
        } 

        createOrderDB(e.target.office.value)
        setAccepted(true)    
    } 

    return (
        <div>
            {!accepted ? <>
                <form onSubmit={createOrder}>
                    <div className="office-choice">
                        <p>Please select office:</p>
                        <input type="radio" id="office_1" name="office" value="LA" />
                        <label htmlFor="office_1">ул. Ленина, 45а</label><br />
                        <input type="radio" id="office_2" name="office" value="MA" />
                        <label htmlFor="office_2">ул. Мира, 32</label><br />
                        <input type="radio" id="office_3" name="office" value="YA" />
                        <label htmlFor="office_3">ул. Ясная, 12</label>
                    </div>
                    <input type="button" value="Back to cart" onClick={() => navigate("/cart")} />
                    <input type="submit" value="ORDER" />
            </form>
            </> : <>
                {order && order["order_id"] ? <>
                    <p>Your order succesfully accepted!</p>
                    <p>ORDER: #{order["order_id"]}</p>
                    <p>You can check order detail <Link to="/">Here</Link></p>
                </> : <>
                    <p>Something went wrong!</p>
                    <p>Try repeat your request after a while</p>
                    <p><Link to="/personal">Personal page</Link></p>
                </>}    
            </>}
        </div>
    )
}

export default ConfirmPage