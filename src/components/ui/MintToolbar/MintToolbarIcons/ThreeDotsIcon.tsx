import React from 'react'
import { useTheme } from 'styled-components'

const ThreeDotsIcon = () => {
  const theme = useTheme()

  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
      <path
        fill={theme.black}
        d="M9.99992 8.75C9.08325 8.75 8.33325 9.5375 8.33325 10.5C8.33325 11.4625 9.08325 12.25 9.99992 12.25C10.9166 12.25 11.6666 11.4625 11.6666 10.5C11.6666 9.5375 10.9166 8.75 9.99992 8.75ZM9.99992 6.125C10.9166 6.125 11.6666 5.3375 11.6666 4.375C11.6666 3.4125 10.9166 2.625 9.99992 2.625C9.08325 2.625 8.33325 3.4125 8.33325 4.375C8.33325 5.3375 9.08325 6.125 9.99992 6.125ZM9.99992 14.875C9.08325 14.875 8.33325 15.6625 8.33325 16.625C8.33325 17.5875 9.08325 18.375 9.99992 18.375C10.9166 18.375 11.6666 17.5875 11.6666 16.625C11.6666 15.6625 10.9166 14.875 9.99992 14.875Z"
      />
    </svg>
  )
}

export default ThreeDotsIcon
