import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Main from 'components/layout/Main'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import { MintButtonLink } from 'components/ui/MintButton'

const LandingText = styled(CMS.RichText)`
  max-width: 800px;
  margin: auto;
  margin-bottom: 8em;

  > p {
    ${({ theme }) => theme.bigParagraph};
  }
`
const Header = styled.header`
  max-width: 950px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 70px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.bigMarketing};
  color: ${({ theme }) => theme.darkPurple};
`

const LoggedOutLanding = () => {
  const data = useIndexPageData()

  return (
    <Main>
      <Header>
        <H1>
          <CMS.Text name="H1" data={data} />
        </H1>
        <MintButtonLink to="/app/#/login/">
          <CMS.Text name="H1" data={data} />
        </MintButtonLink>
      </Header>
      <LandingText name="Intro paragraph" data={data} />
    </Main>
  )
}

export default LoggedOutLanding
