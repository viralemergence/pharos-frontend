import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import LandingPage from 'components/LandingPage/LandingPage'
import NavBar from 'components/layout/NavBar/NavBar'

const IndexPage = (): JSX.Element => (
  <Providers>
    <CMS.SEO />
    <NavBar />
    <LandingPage />
  </Providers>
)

export default IndexPage
