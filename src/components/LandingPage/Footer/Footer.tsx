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
  padding: 40px;
  gap: 30px;
`

const FooterRow = styled.div`
  ${({ theme }) => theme.bigParagraph}
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  @media (max-width: 770px) {
    &.pharos-supporting-orgs {
      flex-flow: column nowrap;
    }
  }
  @media (min-width: 771px) {
    &.pharos-supporting-orgs {
      column-gap: 72px;
    }
  }
`

const FooterLogo = styled(CMS.Image)`
  img {
    max-width: calc(100vw - 75px);
    object-fit: contain !important;
  }
  // Since the NSF logo has more whitespace in it, make the whitespace around
  // each logo seem more even
  @media (max-width: 770px) {
    .pharos-supporting-orgs &:not(.pharos-nsf-logo) {
      position: relative;
      top: -30px;
    }
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
      <FooterRow style={{ rowGap: '30px' }} className="pharos-supporting-orgs">
        <a href={CMS.getText(cmsData, 'NSF link')}>
          <FooterLogo
            name="NSF logo"
            className="pharos-nsf-logo"
            data={cmsData}
            style={{ maxWidth: 346, maxHeight: 100 }}
          />
        </a>
        <a href={CMS.getText(cmsData, 'Open Philanthropy link')}>
          <FooterLogo
            name="Open Philanthropy logo"
            className="pharos-open-philanthropy-logo"
            data={cmsData}
            style={{ maxHeight: 70, maxWidth: 224 }}
          />
        </a>
        <a href={CMS.getText(cmsData, 'GHSS link')}>
          <FooterLogo
            name="GHSS logo"
            className="pharos-ghss-logo"
            data={cmsData}
            style={{ maxWidth: 553, maxHeight: 60 }}
          />
        </a>
      </FooterRow>
    </Container>
  )
}

export default Footer
