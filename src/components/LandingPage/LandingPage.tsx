import React from 'react'
import styled from 'styled-components'

import CMS from 'components/library/airtable-cms'
import Main from 'components/layout/Main'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import { MintButtonLink } from 'components/ui/MintButton'
import LandingMap from './LandingMap/LandingMap'
import Footer from './Footer/Footer'
import useAppState from 'hooks/useAppState'

const heightBreakpointForLandingText = 800

const HeaderContainer = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  @media (max-height: ${heightBreakpointForLandingText}px) {
    justify-content: center;
  }
`
const Header = styled.header`
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 70px;
  padding: 0 40px;
  margin-top: 10vh;
  color: ${({ theme }) => theme.white};
  @media (max-height: ${heightBreakpointForLandingText}px) {
    margin: 0 !important;
  }
`
const H1 = styled.h1`
  ${({ theme }) => theme.bigMarketing};
  transition: all 0.35s;
  @media (max-width: 1000px) {
    ${({ theme }) => theme.bigMarketingMobile};
  }
  @media (max-height: 600px) {
    ${({ theme }) => theme.bigMarketingMobile};
  }
  color: ${({ theme }) => theme.white};
`

const LandingText = styled(CMS.RichText)`
  max-width: 1000px;
  padding-bottom: 30px;

  > p {
    ${({ theme }) => theme.smallMarketing};
    color: ${({ theme }) => theme.white};
    transition: all 0.35s;
    @media (max-width: 400px) {
      ${({ theme }) => theme.smallMarketingMobile};
    }
    margin-top: 0;
  }

  // For small-height viewports, LandingTextForSmallViewports is displayed,
  // instead of this
  @media (max-height: ${heightBreakpointForLandingText}px) {
    display: none;
  }
`

const MobileMapButtonLink = styled(MintButtonLink)`
  @media (min-width: 400px) {
    display: none;
  }
`

const LaptopMapButtonLink = styled(MintButtonLink)`
  @media (max-width: 399px) {
    display: none;
  }
`

/** Text that displays only when viewport is too small to display the white
 * text with the dark map behind it */
const LandingTextForSmallViewports = styled.div`
  display: none;
  width: 100%;
  max-width: unset;
  @media (max-height: ${heightBreakpointForLandingText}px) {
    display: flex;
  }
  background: #0e0f1f;
  ${({ theme }) => theme.smallMarketing};
  color: ${({ theme }) => theme.white};
  padding: 30px 40px;
  p {
    margin: 0;
  }
  & > div {
    max-width: 1000px;
    margin: 0 auto;
  }
  p {
    transition: all 0.35s;
    @media (max-width: 400px) {
      ${({ theme }) => theme.smallMarketingMobile};
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
            <MobileMapButtonLink to="/data#globe">View map</MobileMapButtonLink>
            <LaptopMapButtonLink to="/data#map">View map</LaptopMapButtonLink>
          </ButtonBox>
        </Header>
        <Main style={{ margin: 0, padding: '0 40px' }}>
          <LandingText name="Intro paragraph" data={cmsData} />
        </Main>
      </HeaderContainer>
      <LandingMap />
      <LandingTextForSmallViewports>
        <CMS.RichText name="Intro paragraph" data={cmsData} />
      </LandingTextForSmallViewports>
      <Footer />
    </>
  )
}

export default LoggedOutLanding
