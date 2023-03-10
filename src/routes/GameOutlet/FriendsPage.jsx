import React, { useEffect, useState } from 'react'
import TitlePage from '../../components/reusable/TitlePage'
import SearchFriendInput from '../../components/game/friends/SearchFriendInput'
import SearchPage from '../../components/game/friends/SearchPage'
import '../../Styles/friends.css'
import FriendsReqBtn from '../../components/game/friends/FriendsReqBtn'
import usePageTitle from '../../hooks/usePageTitle'

const FriendUserData = React.lazy(() =>
  import('../../components/game/friends/FriendUserData')
)
function FriendsPage() {
  const [searchTxt, setSearchTxt] = useState('')
  const [pageTitle, setPageTitle] = useState('')

  // Document title change
  usePageTitle(`Taktekha | ${pageTitle}`)

  // Page title
  useEffect(() => {
    if (searchTxt.length !== 0) {
      setPageTitle('Search friends')
    } else {
      setPageTitle('Friends')
    }
  }, [searchTxt])

  return (
    <section className='FREINDS__PAGE'>
      <TitlePage title={pageTitle} />
      <SearchFriendInput setSearchTxt={setSearchTxt} searchTxt={searchTxt} />
      {searchTxt.length > 0 ? (
        <SearchPage searchTxt={searchTxt} />
      ) : (
        <FriendUserData />
      )}
      <FriendsReqBtn />
    </section>
  )
}

export default FriendsPage
