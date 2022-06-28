import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from '../components/layout/Providers'

import Main from '../components/layout/Main'

// import useUserGuidePageData from '../cmsHooks/useUserGuidePageData'
import NavBar from 'components/layout/NavBar/NavBar'

const UserGuidePage = (): JSX.Element => {
  // const data = useUserGuidePageData()

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <Main>
        <h1>User Guide Page</h1>
      </Main>
    </Providers>
  )
}

export default UserGuidePage
