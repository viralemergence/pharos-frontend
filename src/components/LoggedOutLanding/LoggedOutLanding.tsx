import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Main from 'components/layout/Main'

import useIndexPageData from 'cmsHooks/useIndexPageData'

const LoggedOutLanding = () => {
  const data = useIndexPageData()

  return (
    <Main>
      <h1>
        <CMS.Text name="H1" data={data} />
      </h1>
      <CMS.RichText name="Intro paragraph" data={data} />
    </Main>
  )
}

export default LoggedOutLanding
