import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Main from 'components/layout/Main'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import { MintButtonLink } from 'components/ui/MintButton'
import LandingMap from './LandingMap/LandingMap'

const HeaderContainer = styled.div`
  position: absolute;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Header = styled.header`
  max-width: 1000px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 70px;
  color: white;
`
const H1 = styled.h1`
  ${({ theme }) => theme.bigMarketing};
  color: ${({ theme }) => theme.darkPurple};
  margin-top: 50px;
  color: white;
`
const LandingText = styled(CMS.RichText)`
  max-width: 1000px;
  margin: auto;
  margin-bottom: 70px;

  > p {
    ${({ theme }) => theme.h3};
  }
`
const ButtonBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`

const LoggedOutLanding = () => {
  const data = useIndexPageData()

  return (
    <>
      <HeaderContainer>
        <Header>
          <H1>
            <CMS.Text name="H1" data={data} />
          </H1>
          <ButtonBox>
            <MintButtonLink to="/app/#/login/">
              <CMS.Text name="CTA" data={data} />
            </MintButtonLink>
            <MintButtonLink to="/map/">View map</MintButtonLink>
          </ButtonBox>
        </Header>
      </HeaderContainer>
      <LandingMap />
      <Main>
        <LandingText name="Intro paragraph" data={data} />
      </Main>
    </>
  )
}

export default LoggedOutLanding
