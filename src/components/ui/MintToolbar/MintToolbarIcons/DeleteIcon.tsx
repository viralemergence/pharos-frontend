import React from 'react'
import { useTheme } from 'styled-components'

const DeleteIcon = () => {
  const theme = useTheme()

  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        fill={theme.black}
        d="M5.25 16.625C5.25 17.5875 6.0375 18.375 7 18.375H14C14.9625 18.375 15.75 17.5875 15.75 16.625V6.125H5.25V16.625ZM16.625 3.5H13.5625L12.6875 2.625H8.3125L7.4375 3.5H4.375V5.25H16.625V3.5Z"
      />
    </svg>
  )
}

export default DeleteIcon
