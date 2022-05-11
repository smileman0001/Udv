import React from 'react'

import UcoinIcon from "../svgs/UcoinIcon"
import "../css/SvgStyle.css"


const HoveredPart = () => {
  return (
    <div className='svg-wrapper'>
        <div className="back-svg card">
            <div className="avatar-svg">
            </div>
            <div className="information">
                <p>Designer</p>
                <p>Artyom Admin</p>
                <p>550 <UcoinIcon width={30} height={30} /> </p>     
            </div>            
        </div>
        <div className="ucoin-svg big-coin-1"><UcoinIcon width={60} height={60} /></div>
        <div className="ucoin-svg big-coin-2"><UcoinIcon width={60} height={60} /></div>
        <div className="ucoin-svg small-coin"><UcoinIcon width={20} height={20} /></div>
        <div className="ucoin-svg average-coin"><UcoinIcon width={40} height={40} /></div>
    </div>
  )
}

export default HoveredPart