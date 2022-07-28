// import React = require('react')

// export const wrapRootElement = ({ element }) => (
//   <UserContextProvider>{element}</UserContextProvider>
// )

import * as React from 'react'

import type { GatsbyBrowser } from 'gatsby'

import UserContextProvider from './src/components/Login/UserContextProvider'

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
  return <UserContextProvider>{element}</UserContextProvider>
}
