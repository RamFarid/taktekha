import React from 'react'
import { AiFillHome } from 'react-icons/ai'
// import { VscAdd } from 'react-icons/vsc'
import { HiUsers } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import Ripples from 'react-ripples'

import '../../Styles/nav.css'
import FriendsNotification from '../reusable/FriendsNotification'
import { useUser } from '../../contexts/UserContext'
function Nav() {
  const { friendRequests } = useUser()
  return (
    <nav>
      <Ripples>
        <NavLink aria-label='Home Page' to='/' className='nav-link' end>
          <AiFillHome size={20} color='#615a87' />
        </NavLink>
      </Ripples>
      {/* <Ripples>
        <NavLink className='nav-link' to='/gamemaster' end>
          <VscAdd size={20} color='#2475C5' />
        </NavLink>
      </Ripples> */}
      <Ripples className='nav-link-co'>
        {friendRequests.length >= 1 && <FriendsNotification />}
        <NavLink
          aria-label='Friends Page'
          className='nav-link'
          to='/friends'
          end
        >
          <HiUsers size={20} color='#615a87' />
        </NavLink>
      </Ripples>
      <Ripples className='nav-link-co'>
        <NavLink
          aria-label='Settings page'
          to={'/settings'}
          className='nav-link'
        >
          <FiSettings size={20} color='#615a87' />
        </NavLink>
      </Ripples>
    </nav>
  )
}

export default Nav
