import React from 'react'
import TitlePage from '../reusable/TitlePage'
import { BsWhatsapp } from 'react-icons/bs'
import { FaTelegramPlane } from 'react-icons/fa'
import FloatingModel from './FloatingModel'
import { useParams } from 'react-router-dom'

import '../../Styles/portals.css'
import { toast } from 'react-toastify'
import { AiOutlineShareAlt } from 'react-icons/ai'
function Share() {
  const { id } = useParams()
  const copyLink = (e) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(
          `Hey come join my game in Taktekha! Tap on ${window.location.href} or enter my Room id: ${id}`
        )
        .then(
          () => {
            toast('Copied', {
              autoClose: false,
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
      if (e) {
        e.target.select()
        document.execCommand('copy')
      } else if (!e) {
        toast('Click room link or room id to copy')
      }
    }
  }
  const shareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          text: `Tap on link to join my game on Taktekha! or enter my Room id: ${id}`,
          title: 'Taktekha with me',
          url: `${window.location.href}`,
        })
        .catch((er) => {})
    } else {
      copyLink()
    }
  }
  return (
    <FloatingModel className='share-game-wrapper'>
      <TitlePage title='Share and invite' />
      <div className='body'>
        <div className='txt'>Room ID</div>
        <input
          onClick={copyLink}
          type='text'
          value={id || ''}
          className='code'
          readOnly
        />
        <div className='txt'>Link to share</div>
        <input
          onClick={copyLink}
          type='text'
          value={window.location.href || ''}
          className='code'
          readOnly
        />
        <div className='share-links-wrapper'>
          <a
            className='whatsapp link'
            href={`whatsapp://send?text=Hey come join my game in Taktekha! Tap on ${window.location.href} or enter my Room id: ${id}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <BsWhatsapp />
          </a>
          {/* <a
            className='fb link'
            href={`whatsapp://send?text=Hey come join my game in Taktekha! Tap on ${window.location.href} or enter my Room id: ${id}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <FaFacebookF />
          </a> */}
          <a
            className='tg link'
            href={`tg://msg_url?url=${window.location.href}&text=click to join my game on Taktekha! or enter my Room id: ${id}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <FaTelegramPlane />
          </a>
          <button className='link' onClick={shareLink}>
            <AiOutlineShareAlt fill='var(--light-txt)' />
          </button>
        </div>
      </div>
    </FloatingModel>
  )
}

export default Share
