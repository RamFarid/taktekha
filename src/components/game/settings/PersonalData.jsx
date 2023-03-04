import React from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../../contexts/UserContext'

function PersonalData() {
  const { user } = useUser()
  const copyId = (e) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${user.uid}`).then(
        () => {
          toast('Copied your ID, share with your friends', {
            autoClose: 4000,
            hideProgressBar: true,
            position: 'top-left',
            toastId: 'copiedId',
          })
        },
        (er) => {
          toast.error(`Copied by yourself: ${er}`)
          console.log('Error: ' + er)
        }
      )
    } else {
      toast('Copied your ID, share with your friends', {
        autoClose: 4000,
        hideProgressBar: true,
        position: 'top-left',
        toastId: 'copiedId',
      })
      e.target.select()
      document.execCommand('copy')
    }
  }
  return (
    <figure className='acc-info'>
      <img src={user.photoURL} alt={user.displayName} />
      <figcaption>
        <span className='name'>{user.displayName}</span>
        <span className='uid'>
          <input
            type={'text'}
            className='sub-txt'
            onClick={(e) => copyId(e)}
            readOnly
            value={user.uid || ''}
          />
        </span>
      </figcaption>
    </figure>
  )
}

export default PersonalData
