import React from 'react'
import styled from 'styled-components'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import CMS from '@talus-analytics/library.airtable-cms'

const Container = styled.footer`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 30px;
  gap: 15px;
`
const FooterLogo = styled(CMS.Image)``

const Footer = () => {
  const cmsData = useIndexPageData()

  return (
    <Container>
      <a href={CMS.getText(cmsData, 'Verena link')}>
        <FooterLogo
          name="Verena logo"
          data={cmsData}
          style={{ width: 198, height: 80 }}
        />
      </a>
      <a href={CMS.getText(cmsData, 'GHSS link')}>
        <FooterLogo
          name="GHSS logo"
          data={cmsData}
          style={{ width: 553, height: 60 }}
        />
      </a>
      <a href={CMS.getText(cmsData, 'NSF link')}>
        <FooterLogo
          name="NSF logo"
          data={cmsData}
          style={{ width: 346, height: 100 }}
        />
      </a>
      <a href={CMS.getText(cmsData, 'Open Philanthropy link')}>
        <FooterLogo
          name="Open Philanthropy logo"
          data={cmsData}
          style={{ height: 70, width: 224 }}
        />
      </a>
    </Container>
  )
}

export default Footer
