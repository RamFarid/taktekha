import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import Ripples from 'react-ripples'
import TitlePage from './TitlePage'
function PortalsTopBar({ closePortal, title }) {
  return (
    <div className='top-info'>
      <Ripples onClick={closePortal} className='close-portal-btn'>
        <IoIosArrowBack size={24} />
      </Ripples>
      <TitlePage title={title} />
    </div>
  )
}

export default PortalsTopBar
