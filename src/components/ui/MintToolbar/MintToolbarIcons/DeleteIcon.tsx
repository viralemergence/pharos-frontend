import React from 'react'
import { useTheme } from 'styled-components'

const DeleteIcon = () => {
  const theme = useTheme()

  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
      <path
        fill={theme.white}
        d="M4.5 14.75C4.5 15.575 5.175 16.25 6 16.25H12C12.825 16.25 13.5 15.575 13.5 14.75V5.75H4.5V14.75ZM14.25 3.5H11.625L10.875 2.75H7.125L6.375 3.5H3.75V5H14.25V3.5Z"
      />
    </svg>
  )
}

export default DeleteIcon
