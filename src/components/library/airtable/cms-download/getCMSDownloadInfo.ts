import { AirtableCMSData } from 'components/library/airtable/cms-types'

interface DownloadInfo {
  text: string | undefined
  fileName: string
  prettySize: string
  publicURL: string
}

// helper function for finding the link for a file in
// download column in an AirtableCMSData object, and
// returning that as a string, with error handling
// which can be disabled using noEmitError.
function getCMSDownloadInfo(
  data: AirtableCMSData,
  name: string,
  noEmitError: true
): DownloadInfo | undefined
function getCMSDownloadInfo(
  data: AirtableCMSData,
  name: string,
  noEmitError: boolean
): DownloadInfo | undefined
function getCMSDownloadInfo(
  data: AirtableCMSData,
  name: string,
  noEmitError?: false
): DownloadInfo
function getCMSDownloadInfo(
  data: AirtableCMSData,
  name: string,
  noEmitError?: true | false | boolean | undefined
) {
  const cmsNode = data.nodes.find(n => n.data.Name === name)
  const text = cmsNode?.data.Text
  const fileInfo = cmsNode?.data.Download?.localFiles[0]

  if (fileInfo)
    return {
      text,
      fileName: fileInfo.name,
      prettySize: fileInfo.prettySize,
      publicURL: fileInfo.publicURL,
    }

  if (noEmitError === true) return undefined

  throw new Error(
    `Text section ${name} not found in ` +
    `the Airtable data specified. Does that ` +
    `query include the right tables, and ` +
    `does one of those tables include a ` +
    `section called ${name}?`
  )
}

export default getCMSDownloadInfo
