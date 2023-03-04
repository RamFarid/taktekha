import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { Link } from 'react-router-dom'
function HomeBtn() {
  return (
    <Link className='home-btn' to={'/'}>
      <AiOutlineHome size={23} stroke='white' fill='white' />
    </Link>
  )
}

export default HomeBtn
