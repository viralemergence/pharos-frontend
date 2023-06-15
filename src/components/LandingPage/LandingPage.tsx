import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Main from 'components/layout/Main'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import { MintButtonLink } from 'components/ui/MintButton'
import LandingMap from './LandingMap/LandingMap'
import Footer from './Footer/Footer'
import useAppState from 'hooks/useAppState'

const HeaderContainer = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const Header = styled.header`
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 70px;
  padding: 0 40px;
  color: white;
`
const H1 = styled.h1`
  ${({ theme }) => theme.bigMarketing};
  transition: all 0.35s;
  @media (max-width: 700px) {
    ${({ theme }) => theme.bigMarketingMobile};
  }
  color: white;
`
const LandingText = styled(CMS.RichText)`
  max-width: 1000px;
  padding-bottom: 30px;

  > p {
    ${({ theme }) => theme.h3};
    color: white;
    @media (max-width: 400px) {
      font-size: 16px;
      line-height: 1.3;
      font-weight: bold;
    }
  }
`
const ButtonBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`

const LoggedOutLanding = () => {
  const cmsData = useIndexPageData()
  const { user } = useAppState()

  return (
    <>
      <HeaderContainer>
        <Header>
          <H1>
            <CMS.Text name="H1" data={cmsData} />
          </H1>
          <ButtonBox>
            <MintButtonLink to="/app/#/projects/">
              {user.data ? (
                'My projects'
              ) : (
                <CMS.Text name="CTA" data={cmsData} />
              )}
            </MintButtonLink>
            <MintButtonLink to="/data#map">View map</MintButtonLink>
          </ButtonBox>
        </Header>
        <Main>
          <LandingText name="Intro paragraph" data={cmsData} />
        </Main>
      </HeaderContainer>
      <LandingMap />
      <Footer />
    </>
  )
}

export default LoggedOutLanding
