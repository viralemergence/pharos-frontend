import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Main from 'components/layout/Main'

import useIndexPageData from 'cmsHooks/useIndexPageData'

const LandingText = styled(CMS.RichText)`
  > p {
    ${({ theme }) => theme.smallParagraph}
  }
`

const LoggedOutLanding = () => {
  const data = useIndexPageData()

  return (
    <Main>
      <h1>
        <CMS.Text name="H1" data={data} />
      </h1>
      <LandingText name="Intro paragraph" data={data} />
    </Main>
  )
}

export default LoggedOutLanding
