import { signOut } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import React from 'react'
import Ripples from 'react-ripples'
import { toast } from 'react-toastify'
import { useUser } from '../../../contexts/UserContext'
import { auth, realtimedb } from '../../../firebase.config'
function LogOut() {
  const { user } = useUser()
  const signOutHanler = () => {
    const userStatusRef = ref(realtimedb, `users/${user.uid}/status`)
    signOut(auth)
      .then((user) => {
        set(userStatusRef, 'offline')
      })
      .catch((err) => {
        toast.warn(`Can't log out ${err.message}`, {
          hideProgressBar: true,
          autoClose: 2000,
        })
        console.log(err)
      })
  }
  return (
    <Ripples className='logout strict-flag' onClick={signOutHanler}>
      Log out
    </Ripples>
  )
}

export default LogOut
