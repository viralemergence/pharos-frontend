import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from '../components/layout/Providers'

import Main from '../components/layout/Main'

import useIndexPageData from '../cmsHooks/useIndexPageData'
import NavBar from 'components/layout/NavBar/NavBar'

const IndexPage = (): JSX.Element => {
  const data = useIndexPageData()

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <Main>
        <CMS.Image name="Site logo" data={data} />
        <h1>
          <CMS.Text name="H1" data={data} />
        </h1>
        <CMS.RichText name="Intro paragraph" data={data} />
      </Main>
    </Providers>
  )
}

export default IndexPage
