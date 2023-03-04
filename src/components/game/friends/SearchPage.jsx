import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../../contexts/UserContext'
import { db } from '../../../firebase.config'
import DataWrapper from '../../reusable/DataWrapper'
import EmptyMsg from '../../reusable/EmptyMsg'
import SingleDataFriend from '../../reusable/SingleDataFriend'
import Loader from '../../reusable/Loader'

function SearchPage({ searchTxt }) {
  const { user } = useUser()

  const [searchData, setSearchData] = useState({
    loading: false,
    error: '',
    data: [],
  })
  useEffect(() => {
    setSearchData((prev) => ({ ...prev, data: [], error: '' }))

    let timeOut
    if (searchTxt.length !== 0) {
      setSearchData((prev) => ({ ...prev, loading: true }))
      timeOut = setTimeout(async () => {
        try {
          const querySnapshot = await getDocs(
            query(collection(db, 'users'), where('uid', '==', searchTxt.trim()))
          )
          querySnapshot.forEach((doc) => {
            if (user.uid === doc.id) {
              setSearchData((prev) => ({
                ...prev,
                loading: false,
                data: [...searchData.data],
              }))
            } else {
              setSearchData((prev) => ({
                ...prev,
                loading: false,
                data: [...searchData.data, doc.data()],
              }))
            }
          })
          setSearchData((prev) => ({ ...prev, loading: false }))
        } catch (error) {
          setSearchData((prev) => ({
            ...prev,
            loading: false,
            error: error.message,
          }))
          toast.error(`Something went wrong ${error}`)
        }
      }, 1400)
    }
    return () => {
      clearTimeout(timeOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTxt])
  return (
    <DataWrapper>
      <h5>
        ID:
        <span> "{searchTxt}"</span>
      </h5>
      {searchData.loading ? <Loader /> : null}
      {searchData.error ? (
        <EmptyMsg
          txt={'Sorry, somthing went wrong!'}
          subtxt={searchData.error}
        />
      ) : null}
      {searchData?.data?.map((doc) => {
        return (
          <SingleDataFriend
            friendDataFromUsersCollection={doc}
            key={`${doc.id}1`}
          />
        )
      })}
      {searchData?.data.length === 0 &&
        searchData.loading === false &&
        searchData.error.length === 0 && (
          <EmptyMsg
            subtxt={
              'Make sure user ID that you search for consists of 28 character'
            }
            txt='No users found!'
          />
        )}
    </DataWrapper>
  )
}

export default SearchPage
