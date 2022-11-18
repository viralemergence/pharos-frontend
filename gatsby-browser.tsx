import * as React from 'react'

import type { GatsbyBrowser } from 'gatsby'

import StateContextProvider from './src/reducers/stateReducer/stateContext'

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
  return <StateContextProvider>{element}</StateContextProvider>
}
