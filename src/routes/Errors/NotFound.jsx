import React from 'react'
import { NavLink } from 'react-router-dom'
import errorPhoto from '../../assets/error.svg'
import usePageTitle from '../../hooks/usePageTitle'

import '../../Styles/errors.css'
function NotFound() {
  usePageTitle('Taktekha | 404 Not found')
  return (
    <React.Fragment>
      <section className='Error'>
        <img src={errorPhoto} alt='404_not_found' className='Error__photo' />
        <h2>404 page not found!</h2>
        <p className='sub-txt'>
          Check to see if the link you are trying to open is valid.
        </p>
        <NavLink to='/' className='primary-btn'>
          Go to home page
        </NavLink>
      </section>
    </React.Fragment>
  )
}

export default NotFound
