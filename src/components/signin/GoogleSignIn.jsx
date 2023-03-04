import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import Ripples from 'react-ripples'
// import { useUser } from '../../contexts/UserContext'
import { auth, googleProvider, initNewUser } from '../../firebase.config'

function GoogleSignIn({ clicked, setClicked }) {
  // const { displayError } = useUser()
  const handleGoogleAuth = () => {
    setClicked(true)
    signInWithPopup(auth, googleProvider)
      .then((user) => {
        if (getAdditionalUserInfo(user).isNewUser) {
          initNewUser(user)
        }
        setClicked(false)
      })
      .catch((er) => {
        console.log(er.code)
        setClicked(false)
        // displayError(er.code)
      })
  }
  return (
    <Ripples
      className={
        clicked === true
          ? 'sign-in-btn disabled-flag avoid-pointer-events'
          : 'sign-in-btn'
      }
      onClick={handleGoogleAuth}
    >
      <FcGoogle size={21} /> Sign in with Google
    </Ripples>
  )
}

export default GoogleSignIn
