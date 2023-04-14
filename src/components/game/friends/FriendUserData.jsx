import React from 'react'
import DataWrapper from '../../reusable/DataWrapper'
import SingleDataFriend from '../../reusable/SingleDataFriend'
import EmptyMsg from '../../reusable/EmptyMsg'
import { useUser } from '../../../contexts/UserContext'
import PullToRefresh from 'react-simple-pull-to-refresh'
import ErrorBoundary from '../../reusable/ErrorBoundary'
function FriendUserData() {
  const { friendsList, refreshFriends } = useUser()
  return (
    <DataWrapper>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <PullToRefresh onRefresh={refreshFriends}>
          {friendsList?.length === 0 ? (
            <EmptyMsg subtxt={'Send some requests'} txt='No Friends' />
          ) : (
            friendsList?.map((data) => {
              return (
                <ErrorBoundary fallback={<>Error: {data}</>} key={data?.uid}>
                  <SingleDataFriend friendDataFromUsersCollection={data} />
                </ErrorBoundary>
              )
            })
          )}
        </PullToRefresh>
      </ErrorBoundary>
    </DataWrapper>
  )
}

const ErrorComponent = () => {
  return <div>Error occured</div>
}

export default FriendUserData
