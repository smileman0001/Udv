import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

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

        console.log("INDEX: ", e.target.name)
        console.log("CART: ", cart)

        let removed_product_id = cart[e.target.name].product_id
        let newArr = cart.slice(0, e.target.name).concat(cart.slice(e.target.name + 1))
        
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
            .then(response => getUserCart())
        }

        deleteData(removed_product_id)
    }

    return (
        <>
            {totalSum && cart ? <form>
            {cart.map((item, index) => {
                return (
                    <div className='cart-item'>
                        <p>INDEX: {index}</p>
                        <p>Product name: {item["product_name"]}</p>
                        <p>Product photo: {item["product_photo"]}</p>
                        <p>Product price: {item["product_price"]}</p>
                        <p>Count:   
                            <input name={index}
                            type="number" min="1" max="10" value={item["count"]} 
                            onChange={(e) => changeCount(e)} />
                            <input type="button" value="Delete" 
                            name={index} onClick={(e) => deleteProduct(e) } />
                        </p>
                    </div>
                )
            })}
            <p className='total-price'>Total sum: {totalSum}</p>
            <div><input type="button" value="Place an order" 
                    onClick={() => {
                        if (location.pathname === "/store") {
                            navigate("/cart")
                        } else {
                            navigate("/confirm")
                        }
                        }} /></div>
            </form> : 
            <p>Cart is empty</p>}
        </>
    )
}

export default Cart