import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import ClientRouter from 'components/ClientRouter/ClientRouter'

const IndexPage = (): JSX.Element => (
  <Providers>
    <CMS.SEO />
    <NavBar />
    <ClientRouter />
  </Providers>
)

export default IndexPage
