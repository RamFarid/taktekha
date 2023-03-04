import React from 'react'
import DataWrapper from '../../reusable/DataWrapper'
import SingleDataFriend from '../../reusable/SingleDataFriend'
import EmptyMsg from '../../reusable/EmptyMsg'
import { useUser } from '../../../contexts/UserContext'
import PullToRefresh from 'react-simple-pull-to-refresh'
function FriendUserData() {
  const { friendsList, refreshFriends } = useUser()
  return (
    <DataWrapper>
      <PullToRefresh onRefresh={refreshFriends}>
        {friendsList?.length === 0 ? (
          <EmptyMsg subtxt={'Send some requests'} txt='No Friends' />
        ) : (
          friendsList?.map((data) => {
            return (
              <SingleDataFriend
                friendDataFromUsersCollection={data}
                key={`${data.uid}2`}
              />
            )
          })
        )}
      </PullToRefresh>
    </DataWrapper>
  )
}

export default FriendUserData
