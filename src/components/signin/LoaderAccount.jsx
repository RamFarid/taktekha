import React from 'react'
// import { BsArrowClockwise } from 'react-icons/bs'

import '../../Styles/loader-account.css'
function LoaderAccount() {
  return (
    <section className='loader-account'>
      <div className='txt-loader'>Connecting to the Server</div>
      <div className='loader-bar'>
        <div className='bar'></div>
      </div>
    </section>
  )
}

export default LoaderAccount
