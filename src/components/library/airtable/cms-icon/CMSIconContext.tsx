import React, { createContext } from 'react'
import { AirtableCMSData } from 'components/library/airtable/cms-types'

export const IconsContext = createContext<null | AirtableCMSData>(null)

export interface CMSIconProviderProps {
  children: React.ReactNode
  data: AirtableCMSData
}

const CMSIconProvider = ({
  children,
  data,
}: CMSIconProviderProps): JSX.Element => (
  <IconsContext.Provider value={data}>{children}</IconsContext.Provider>
)

export default CMSIconProvider
