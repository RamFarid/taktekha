import React from 'react'
import LOGO from '../../assets/LOGO.webp'

function Overview() {
  return (
    <section className='overview'>
      <img src={LOGO} alt='tic tac toe' />
      <h5>Welcome</h5>
      <p className='sub-txt'>Please sign in to continue.</p>
    </section>
  )
}

export default Overview
