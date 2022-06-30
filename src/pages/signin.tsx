import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from '../components/layout/Providers'

import Main from '../components/layout/Main'
import NavBar from 'components/layout/NavBar/NavBar'
import Login from 'components/Login/Login'

const LoginPage = (): JSX.Element => (
  <Providers>
    <CMS.SEO />
    <NavBar />
    <Main>
      <Login />
    </Main>
  </Providers>
)

export default LoginPage
