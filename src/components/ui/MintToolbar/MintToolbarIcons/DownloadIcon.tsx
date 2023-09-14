import React from 'react'
import { useTheme } from 'styled-components'

const DownloadIcon = () => {
  const theme = useTheme()

  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        d="M16.625 7.875H13.125V2.625H7.875V7.875H4.375L10.5 14L16.625 7.875ZM4.375 15.75V17.5H16.625V15.75H4.375Z"
        fill={theme.black}
      />
    </svg>
  )
}

export default DownloadIcon
