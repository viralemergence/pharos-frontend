import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from '../components/layout/Providers'

import Main from '../components/layout/Main'

// import useAboutPageData from '../cmsHooks/useAboutPageData'
import NavBar from 'components/layout/NavBar/NavBar'

const AboutPage = (): JSX.Element => {
  // const data = useAboutPageData()

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <Main>
        <h1>About Page</h1>
      </Main>
    </Providers>
  )
}

export default AboutPage
