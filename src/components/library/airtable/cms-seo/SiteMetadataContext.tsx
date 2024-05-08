import React from 'react'
import { AirtableCMSData } from 'components/library/airtable/cms-types'
import CookieConsent from './CookieConsent'

export interface SiteMetadataContext {
  data: AirtableCMSData
  trackingId?: string
}

// context object
export const SiteMetadataContext =
  React.createContext<null | SiteMetadataContext>(null)

// context provider props
export interface SiteMetadataProviderProps {
  children: JSX.Element | JSX.Element[]
  data: AirtableCMSData
  trackingId?: string
}

// context provider
const SiteMetadataProvider = ({
  children,
  data,
  trackingId,
}: SiteMetadataProviderProps) => {
  return (
    <SiteMetadataContext.Provider value={{ data, trackingId }}>
      {children}
      <CookieConsent />
    </SiteMetadataContext.Provider>
  )
}

export default SiteMetadataProvider
