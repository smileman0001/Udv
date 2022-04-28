import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Cart from '../components/Cart'
import "../css/StorePage.css"
import BannerSvg from '../svgs/BannerSvg'
import UcoinIcon from '../svgs/UcoinIcon'

const StorePage = () => {

    let [productsList, setProductsList] = useState([])


    useEffect( () => {
        getProductsList()
    }, [])

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

    const chunks = (arr, size) => 
        Array.from(
            new Array(Math.ceil(arr.length / size)),
            (_, i) => arr.slice(i * size, i * size + size)
        );

    return (
        <div className='container'>
            <h2 className='center-text'>Store Page</h2>
            <div class="banner">
                <BannerSvg />
            </div>
            <div className='marketplace'>
                <div class="title">
                    <ul>
                        <li><span className="category">Все товары</span></li>
                        <li><span className="category">Футболки</span></li>
                        <li><span className="category">Кружки</span></li>
                        <li><span className="category">Аксессуары</span></li>
                    </ul>
                </div>
                <div className='products-wrapper'>
                    {chunks(productsList, 3).map(chunck => (
                        <div className='products-row'>
                            {chunck.map(product => (
                                <Link className='link-extended' to={"/store/" + String(product.product_id)}>
                                    <div className='products-item'>
                                        <div className="item-img">
                                            <img src="" alt="*Here product image*"></img>
                                        </div>
                                        <div className='item-info'>
                                            <div className='item-name'>{product["name"]}</div>
                                            <div className='item-price'>
                                                {product["price"]} 
                                                <UcoinIcon width={20} height={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>  
                    ))}
                </div>
                <div className='cart-wrapper'>
                    <Cart />
                </div>
            </div>
        </div>
    )
}

export default StorePage