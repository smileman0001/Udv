import React from 'react'

import Cart from '../../components/Cart'
import Marketplace from '../../components/Marketplace'
import BannerSvg from '../../svgs/BannerSvg'

import "../../css/StorePage.css"

const StorePage = () => {
    return (
        <>
        <div className='container'>
            <div className="banner">
                <BannerSvg />
            </div>

            <div className='marketplace-wrapper'>
                <Marketplace />    
            </div>        
        </div>

        <Cart />    
        </>
    )
}

export default StorePage