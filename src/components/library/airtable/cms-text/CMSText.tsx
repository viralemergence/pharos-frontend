import React from 'react'
import { AirtableCMSData } from 'components/library/airtable/cms-types'
import getCMSText from './getCMSText'

export interface CMSTextProps {
  /**
   * name of the text section in the table
   */
  name: string
  /**
   * result from the standard-format airtable
   * CMS query; may include both text and images.
   */
  data: AirtableCMSData
  /**
   * Optional object to replace text in the
   * returned string. The key is the placeholder to
   * replace, and the value is the replacement.
   */
  replace?: { [key: string]: string }
  /**
   * Suppress error handling; this will return
   * an empty fragment instead of throwing an
   * error if the requested text is missing
   * or empty.
   */
  noEmitError?: boolean
}

const CMSText = ({
  data,
  name,
  replace = {},
  noEmitError = false,
}: CMSTextProps): JSX.Element => {
  const text = getCMSText(data, name, noEmitError, replace)
  if (!text) return <></>

  return <>{text}</>
}

export default CMSText
