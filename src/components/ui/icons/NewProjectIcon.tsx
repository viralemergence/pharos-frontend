import React from 'react'
import { useTheme } from 'styled-components'

const NewProjectIcon = () => {
  const theme = useTheme()

  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      style={{ marginRight: 10 }}
    >
      <g clipPath="url(#clip0_5829_180)">
        <path
          fill={theme.black}
          d="M15 10.7H10.2V15.5H7.8V10.7H3V8.3H7.8V3.5H10.2V8.3H15V10.7Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_5829_180">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default NewProjectIcon
