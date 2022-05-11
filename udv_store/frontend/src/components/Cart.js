import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { useNavigate, useLocation, createRoutesFromChildren } from 'react-router-dom'
import UcoinIcon from '../svgs/UcoinIcon'
import "../css/componentStyle/Cart.css"

const Cart = () => {
    let {authTokens} = useContext(AuthContext)
    let [totalSum, setTotalSum] = useState(0)
    let [cart, setCart] = useState(null)
    let navigate = useNavigate()
    let location = useLocation()

    useEffect( () => {
        getUserCart()
    }, [])

    let getUserCart = () => {
        axios({
            method: "GET",
            url: 'http://localhost:8000/api/get-cart/',
            headers: {
                'Content-Type': "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        .then(response => setCart(response.data["cur_cart"]))
        .catch(err => console.log("ERROR: ", err))
    }


    let getTotalSum = async () => {
        let itemsSum = 0
        if (cart && cart.length > 0) {
            cart.map(item => {
                itemsSum += item["product_price"] * item["count"]
            })
        }
        setTotalSum(itemsSum)
    }

    useEffect( () => {
        if (cart !== null) {
            getTotalSum()
        } 
    }, [cart])

    let changeCount = (e) => {
        e.preventDefault()
        let newArr = [...cart]
        newArr[e.target.name].count = Number(e.target.value)

        setCart(newArr)

        const fetchData = async (product_id, new_count) => {
            let url = "http://localhost:8000/api/get-cart/"
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                },
                body: JSON.stringify({
                    "product_id": product_id,
                    "count": new_count
                })
            })
            .catch(err => console.log("ERROR: ", err))
        }

        let product = cart[e.target.name]
        fetchData(product.product_id, product.count)
    }

    let deleteProduct = (e) => {
        e.preventDefault()  
        let removed_product_id = cart[e.target.name].product_id
        let newArr = [...cart]
        newArr.splice(e.target.name, 1);        

        setCart(newArr)

        const deleteData = async (product_id) => {
            let url = "http://localhost:8000/api/get-cart/"
            await fetch(url, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                },
                body: JSON.stringify({
                    "product_id": product_id
                })
            })
        }

        deleteData(removed_product_id)
    }

    return (
        <>
        <div className='cart-wrapper'>
            <div className='cart-header'>
                <input type="button" value="Close" onClick={() => {
                document.querySelector(".cart-wrapper").classList.remove("anim-appearance")
                document.querySelector(".cart-wrapper").classList.add("anim-disappearance")
                }} />
            </div>
            <div id="cart" className='cart-body'>
                {totalSum && cart ? <form>
                {cart.map((item, index) => {
                    return (
                        <div className='cart-item'>
                            <p>Product name: {item["product_name"]}</p>
                            <p>Product photo: {item["product_photo"]}</p>
                            <p>Product price: {item["product_price"]}<UcoinIcon width={15} height={15} /></p>
                            <p>Count:   
                                <input name={index}
                                type="number" min="1" max="10" value={item["count"]} 
                                onChange={(e) => changeCount(e)} />
                                <input className='delete-button' type="button" value="Delete" 
                                name={index} onClick={(e) => deleteProduct(e) } />
                            </p>
                        </div>
                    )
                })} </form> : 
                <p>Cart is empty</p>}
            </div>
            <div className='cart-footer'>
                {totalSum && cart ? <>
                    <p className='total-price'>Total sum: {totalSum}<UcoinIcon width={20} height={20} /></p>
                    <div>
                        <input className='order-button' type="button" value="Order!" 
                            onClick={() => { navigate("/confirm") }} />
                    </div>
                    </> : <><p> </p></>}
            </div>
        </div>
        <div className='open-cart-btn'>
            <input type='button' name="cart-btn" value="Open cart"
            onClick={() => {
                document.querySelector(".cart-wrapper").classList.remove("anim-disappearance")
                document.querySelector(".cart-wrapper").classList.add("anim-appearance")
            }} />
        </div>
        </>
    )
}

export default Cart