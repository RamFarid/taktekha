import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { ImCross } from 'react-icons/im'

function SearchFriendInput({ setSearchTxt, searchTxt }) {
  return (
    <div className='input-co'>
      <BiSearchAlt color='#adadad' />
      <input
        type='text'
        className='search-input'
        placeholder='Search friends, type friend ID'
        value={searchTxt}
        onChange={(e) => setSearchTxt(e.target.value)}
      />
      {searchTxt.length !== 0 ? (
        <div className='clear' onClick={() => setSearchTxt('')}>
          <ImCross size={21} />
        </div>
      ) : null}
    </div>
  )
}

export default SearchFriendInput
