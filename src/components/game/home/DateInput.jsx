import React from 'react'

function DateInput() {
  return (
    <div className='date-input-co'>
      <input
        type='date'
        max={new Date().toISOString().split('T')[0]}
        placeholder='What date?'
      />
    </div>
  )
}

export default DateInput
