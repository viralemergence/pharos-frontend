import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
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
<<<<<<< HEAD
||||||| merged common ancestors
>>>>>>>>> Temporary merge branch 2
=======
  top: 80px;
>>>>>>> review
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
  @media (max-width: 1000px) or (max-height: 600px) {
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

  // For small-height viewports, LandingTextForSmallViewports is displayed,
  // instead of this
  @media (max-height: ${heightBreakpointForLandingText}px) {
    display: none;
  }
`

/** Text that displays only when viewport is too small to display the white
 * text with the dark map behind it */
const LandingTextForSmallViewports = styled(LandingText)`
  display: none;
  width: 100%;
  max-width: unset;
  @media (max-height: ${heightBreakpointForLandingText}px) {
    display: flex;
  }
  background: ${({ theme }) => theme.black};
  padding: 30px 48px;
  p {
    margin: 0;
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
<<<<<<< HEAD
      <LandingMap />
||||||| merged common ancestors
<<<<<<<<< Temporary merge branch 1
      <FooterHeaderText>
        <CMS.Text name="Above footer" data={cmsData} />
      </FooterHeaderText>
||||||||| eb469e8
      <LandingMap />
      <FooterHeaderText>
        <CMS.Text name="Above footer" data={cmsData} />
      </FooterHeaderText>
=========
      <LandingMap />
>>>>>>>>> Temporary merge branch 2
=======
      <LandingTextForSmallViewports name="Intro paragraph" data={cmsData} />
>>>>>>> review
      <Footer />
    </>
  )
}

export default LoggedOutLanding
