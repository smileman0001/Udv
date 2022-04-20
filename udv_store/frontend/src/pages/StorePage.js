import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import "../css/StorePage.css"

const StorePage = () => {

    let {user, authTokens} = useContext(AuthContext)
    let [productsList, setProductsList] = useState([])
    let [cartItems, setCartItems] = useState([
        { product: null, count: 0 }
    ])


    useEffect( () => {
        getProductsList()
    }, [])

    useEffect( () => {
        getCartItems()
    }, [productsList])

    useEffect( () => {
        console.log("CART: ", cartItems)
    }, [cartItems])

    let getProductsList = async () => {
        let url = "http://localhost:8000/api/products/"
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        let data = await response.json()

        if (response.status === 200 ) {
            setProductsList(productsList = data)
        } else {
            alert("Something went wrong!")
        }
    }


    function getProductInfo(product_id) {
        return (productsList).filter(
            function(data) {
                return data.product_id == product_id
            }
        )
    }


    let getCartItems = async () => {
        let url = "http://localhost:8000/api/get-cart/"
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })

        let data = await response.json()
        if ((await response).status === 200) {
            data.forEach(element => {
                setCartItems([
                    ...cartItems,
                    {
                        product: getProductInfo(element.product_id),
                        count: element.count
                    }
                ])
            });
        } else {
            alert("Smt went wrong!")
        }
    }

    return (
        <>
            <h2 className='center-text'>Store Page</h2>
            <div className='banner-wrapper'>
                <div className='big-black-banner'></div>
            </div>
            <div className='products-list-wrapper'>
                <div className='products-list'>
                    {productsList.map(product => (
                        <Link className="link-extended" to={"/store/" + String(product.product_id)}>
                            <div className='store-item'>
                                <img src="" alt="*Here product image*"></img>
                                <p>Name: {product.name}</p>
                                <p>Price: {product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='cart-wrapper'>
                    {user || cartItems.length == 0 ? (
                        <>
                            {/* <form>
                                {cartItems.map(item => {
                                    return (
                                        <>
                                            <p>Product: {item.product.name}</p>
                                            <p>Price: {item.product.price}</p>
                                            <p>Count:
                                                <input type="number" min="1" max="10" step="1"
                                                value={item.count} onChange={setCartItems(item.count + 1)} />
                                            </p>
                                        </>
                                    )
                                })}
                            </form> */}
                        </>
                    ) : (
                        <>
                            <p>Cart is Empty</p>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default StorePage