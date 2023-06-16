import React from 'react'
import styled from 'styled-components'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import CMS from '@talus-analytics/library.airtable-cms'

const Container = styled.footer`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 30px;
  gap: 30px;
`

const FooterRow = styled.div`
  ${({ theme }) => theme.bigParagraph}
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  @media (max-width: 400px) {
    ${({ theme }) => theme.smallParagraph}
  }
`
const SponsorsRow = styled(FooterRow)`
  gap: 30px;
  @media (max-width: 770px) {
    flex-flow: column nowrap;
  }
  @media (min-width: 771px) {
    column-gap: 72px;
  }
`

const FooterLogo = styled(CMS.Image)`
  img {
    max-width: calc(100vw - 75px);
    object-fit: contain !important;
  }
`

const NationalScienceFoundationLogo = styled(FooterLogo)``

const OpenPhilanthropyLogo = styled(FooterLogo)`
  @media (max-width: 770px) {
    position: relative;
    top: -20px;
  }
`

const GeorgetownGlobalHealthLogo = styled(FooterLogo)`
  @media (max-width: 770px) {
    position: relative;
    top: -20px;
  }
`

const Footer = () => {
  const cmsData = useIndexPageData()

  return (
    <Container>
      <FooterRow style={{ columnGap: '30px', rowGap: '10px' }}>
        Pharos is a
        <a href={CMS.getText(cmsData, 'Verena link')}>
          <FooterLogo
            name="Verena logo"
            data={cmsData}
            style={{ width: 198, height: 80 }}
          />
        </a>
        project and is made possible with support from:
      </FooterRow>
      <SponsorsRow>
        <a href={CMS.getText(cmsData, 'NSF link')}>
          <NationalScienceFoundationLogo
            name="NSF logo"
            data={cmsData}
            style={{ maxWidth: 346, maxHeight: 100 }}
          />
        </a>
        <a href={CMS.getText(cmsData, 'Open Philanthropy link')}>
          <OpenPhilanthropyLogo
            name="Open Philanthropy logo"
            data={cmsData}
            style={{ maxHeight: 70, maxWidth: 224 }}
          />
        </a>
        <a href={CMS.getText(cmsData, 'GHSS link')}>
          <GeorgetownGlobalHealthLogo
            name="GHSS logo"
            data={cmsData}
            style={{ maxWidth: 553, maxHeight: 60 }}
          />
        </a>
      </SponsorsRow>
    </Container>
  )
}

export default Footer
