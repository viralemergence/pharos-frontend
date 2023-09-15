import React from 'react'
import { useTheme } from 'styled-components'

const ValidateIcon = () => {
  const theme = useTheme()

  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <g clip-path="url(#clip0_5697_6008)">
        <path
          fill={theme.black}
          d="M18.46 10.3C18.46 10.32 18.76 10.04 18.76 10.06H20.5L17.48 13.56L14.42 10.06H16.16C16.16 10.04 16.54 10.32 16.54 10.3C16.54 6.95999 13.96 4.25999 10.78 4.25999C9.33999 4.25999 8.01999 4.81999 7.01999 5.73999L5.73999 4.21999C7.09999 2.97999 8.85999 2.23999 10.78 2.23999C15.02 2.23999 18.46 5.85999 18.46 10.3Z"
        />
        <path
          fill={theme.black}
          d="M2.54 10.6999C2.54 10.6799 2.24 10.9599 2.24 10.9399H0.5L3.52 7.43994L6.58 10.9399H4.84C4.84 10.9599 4.46 10.6799 4.46 10.6999C4.46 14.0399 7.04 16.7399 10.22 16.7399C11.66 16.7399 12.98 16.1799 13.98 15.2599L15.26 16.7799C13.9 18.0199 12.14 18.7599 10.22 18.7599C5.98 18.7599 2.54 15.1399 2.54 10.6999Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_5697_6008">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ValidateIcon
