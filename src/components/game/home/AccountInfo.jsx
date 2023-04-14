import React from 'react'
import { useUser } from '../../../contexts/UserContext'
import SingleScore from './SingleScore'

function AccountInfo({ userDataFromUsersCollection }) {
  const { user } = useUser()
  return (
    <div className='account-info'>
      <div className='hi'>Welcome</div>
      <figure>
        <img
          src={
            userDataFromUsersCollection?.photo
              ? userDataFromUsersCollection?.photo
              : user.photoURL
          }
          alt={
            userDataFromUsersCollection?.displayName &&
            userDataFromUsersCollection?.displayName
          }
        />
        <figcaption>
          <span className='name'>
            {userDataFromUsersCollection?.displayName
              ? userDataFromUsersCollection?.displayName
              : user.displayName}
          </span>
          <span className='uid'>
            <span type={'text'} className='sub-txt'>
              {userDataFromUsersCollection?.uid
                ? userDataFromUsersCollection?.uid
                : user.uid}
            </span>
          </span>
        </figcaption>
      </figure>
      <div className='score-co'>
        {userDataFromUsersCollection?.games && (
          <React.Fragment>
            <SingleScore
              score={userDataFromUsersCollection?.games[0]}
              scoreType={'Wins'}
            />
            <SingleScore
              score={userDataFromUsersCollection?.games[1]}
              scoreType={'Loses'}
            />
            <SingleScore
              score={userDataFromUsersCollection?.games[2]}
              scoreType={'Draws'}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default AccountInfo
