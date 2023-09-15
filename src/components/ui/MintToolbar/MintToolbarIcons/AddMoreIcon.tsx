import React from 'react'
import { useTheme } from 'styled-components'

const AddMoreIcon = () => {
  const theme = useTheme()

  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        fill={theme.black}
        d="M17.8499 6.30005H12.5999V1.05005H8.3999V12.6H17.8499V6.30005Z"
      />
      <path
        fill={theme.black}
        d="M13.6499 1.05005V5.25005H17.8499L13.6499 1.05005Z"
      />
      <path
        fill={theme.black}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.33076 12.25H6.16924V14.8308H8.75V16.6692H6.16924V19.25H4.33076V16.6692H1.75V14.8308H4.33076V12.25Z"
      />
    </svg>
  )
}

export default AddMoreIcon
