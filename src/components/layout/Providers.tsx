import React from 'react'

import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'

import useSiteMetadataQuery from 'cmsHooks/useSiteMetadataQuery'
import useIconsQuery from 'cmsHooks/useIconsQuery'
import getTrackingId from 'utilities/trackingId'

import textStyles from 'figma/textStyles'
import colorPalette from 'figma/colorPalette'
import zIndexes from './ZIndexes'

import '../../../static/assets/fonts/fonts.css'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: "Poppins", Arial, Helvetica, sans-serif;
    color: ${({ theme }) => theme.black};
  }
`

const WhiteBackground = styled.div`
  background-color: ${({ theme }) => theme.white};
  min-height: 100vh;
  min-width: 100%;
  display: flow-root;
`

// site-wide contexts for themes, icons, and metadata
const Providers = ({ children }: { children: React.ReactNode }) => {
  const icons = useIconsQuery()
  const siteMetadata = useSiteMetadataQuery()
  // get GA tracking ID
  const trackingId = getTrackingId()

  return (
    <React.StrictMode>
      <CMS.IconProvider data={icons}>
        <CMS.SiteMetadataProvider data={siteMetadata} trackingId={trackingId}>
          <ThemeProvider theme={{ ...textStyles, ...colorPalette, zIndexes }}>
            <GlobalStyle />
            <WhiteBackground>{children}</WhiteBackground>
          </ThemeProvider>
        </CMS.SiteMetadataProvider>
      </CMS.IconProvider>
    </React.StrictMode>
  )
}

export default Providers
