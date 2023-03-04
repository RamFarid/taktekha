import { AnimatePresence } from 'framer-motion'
import React from 'react'
import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'
import DataWrapper from '../reusable/DataWrapper'
import PortalsTopBar from '../reusable/PortalsTopBar'
import { useUser } from '../../contexts/UserContext'
import SingleDataReqFriend from '../reusable/SingleDataReqFriend'
import EmptyMsg from '../reusable/EmptyMsg'

function FriendsRequestPage({ reqPage, setReqPage }) {
  const { friendRequests } = useUser()
  return ReactDOM.createPortal(
    <AnimatePresence key={'friendsUserRequest'}>
      {reqPage && (
        <motion.section
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 100,
          }}
          className='FRIENDS__REQ_PAGE'
        >
          <PortalsTopBar
            title={'Friends requests'}
            closePortal={() => setReqPage(false)}
          />
          <DataWrapper>
            {friendRequests.length === 0 ? (
              <EmptyMsg
                txt={'Empty Requests'}
                subtxt={'Your friend requests clean'}
              />
            ) : (
              friendRequests.map((req) => {
                return (
                  <SingleDataReqFriend uid={req.from} key={req.to + req.from} />
                )
              })
            )}
          </DataWrapper>
        </motion.section>
      )}
    </AnimatePresence>,
    document.getElementById('portals')
  )
}

export default FriendsRequestPage
