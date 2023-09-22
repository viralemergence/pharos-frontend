import React from 'react'
import { useTheme } from 'styled-components'

const EditIcon = () => {
  const theme = useTheme()

  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        fill={theme.black}
        d="M4.14018 13.2156L2.625 18.375L7.83359 16.9304L4.14018 13.2156Z"
      />
      <path
        fill={theme.black}
        d="M4.63416 12.2872L11.0713 5.81274L15.2052 9.97065L8.76811 16.4451L4.63416 12.2872Z"
      />
      <path
        fill={theme.black}
        d="M17.9572 7.20323C18.2247 6.93413 18.375 6.56917 18.375 6.18867C18.375 5.80818 18.2247 5.44321 17.9572 5.17412L15.8406 3.04518C15.573 2.77608 15.2102 2.625 14.8319 2.625C14.4535 2.625 14.0907 2.77609 13.8231 3.04518L11.7804 5.09977L15.9143 9.25767L17.9572 7.20323Z"
      />
    </svg>
  )
}

export default EditIcon
