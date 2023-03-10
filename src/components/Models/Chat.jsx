import React, { useEffect, useRef, useState } from 'react'
import ChatMsg from '../game/board/ChatMsg'
import { IoMdSend } from 'react-icons/io'
import TitlePage from '../reusable/TitlePage'
import FloatingModel from './FloatingModel'
import { AnimatePresence, motion } from 'framer-motion'
import { db } from '../../firebase.config'
import { useGameData } from '../../contexts/GameContext'
import { useUser } from '../../contexts/UserContext'
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import getDate from '../../getDate'
import EmptyMsg from '../reusable/EmptyMsg'

function Chat({ setChatAppear, setSeen }) {
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const { onlineGame } = useGameData()
  const { user } = useUser()
  const [msgTxt, setMsgTxt] = useState('')
  useEffect(() => {
    bottomRef.current.scrollIntoView()
    // setSeen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineGame.chat])
  const handleCLoses = (e) => {
    if (e.target.className === e.currentTarget.className) {
      setChatAppear(false)
    }
  }
  const sendMsg = () => {
    updateDoc(doc(db, 'games', onlineGame.id), {
      chat: arrayUnion({ msg: msgTxt, uid: user.uid, time: Timestamp.now() }),
    }).catch((error) => {
      toast.error("Can't send your message")
      console.log(error)
    })
    inputRef.current.innerHTML = ''
    setMsgTxt('')
  }
  return (
    <FloatingModel closePortal={handleCLoses} className='chat-wrapper'>
      <TitlePage title={'Chat'} />
      <div className='msgs-co'>
        {!onlineGame?.chat?.length ? (
          <EmptyMsg subtxt={'chat is clean!'} txt={'There are no messages'} />
        ) : (
          onlineGame?.chat?.map((msg) => {
            return (
              <ChatMsg
                key={msg?.time?.seconds}
                txt={msg?.msg}
                time={getDate(msg?.time?.seconds)}
                reverse={msg?.uid === user.uid ? true : false}
              />
            )
          })
        )}
        <div ref={bottomRef}></div>
      </div>
      {onlineGame.status.isEnded === false ? (
        <div className='new-msg-wrapper'>
          <AnimatePresence key='labelChat'>
            {msgTxt.length === 0 ? (
              <motion.label
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, x: 15 }}
              >
                Message
              </motion.label>
            ) : null}
          </AnimatePresence>
          <motion.div
            className='msg-input'
            contentEditable
            dir='auto'
            onInput={(e) => setMsgTxt(e.target.textContent)}
            ref={inputRef}
          />
          <button
            aria-label='Send mwssage'
            className={
              msgTxt.trim().length !== 0
                ? 'send-btn available'
                : 'send-btn avoid-pointer-events'
            }
            onClick={sendMsg}
          >
            <IoMdSend size={19} />
          </button>
        </div>
      ) : null}
    </FloatingModel>
  )
}

export default Chat
