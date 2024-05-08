import { AirtableCMSData } from 'components/library/airtable/cms-types'

// helper function for finding text in an AirtableCMSData
// object, and returning that as a string, with error
// handling which can be disabled using noEmitError.
function getCMSText(
  data: AirtableCMSData,
  name: string,
  noEmitError: true,
  replace?: { [key: string]: string }
): string | undefined
function getCMSText(
  data: AirtableCMSData,
  name: string,
  noEmitError: boolean,
  replace?: { [key: string]: string }
): string | undefined
function getCMSText(
  data: AirtableCMSData,
  name: string,
  noEmitError?: false,
  replace?: { [key: string]: string }
): string
function getCMSText(
  data: AirtableCMSData,
  name: string,
  noEmitError?: true | false | boolean | undefined,
  replace?: { [key: string]: string }
) {
  const text = data.nodes.find(n => n.data.Name === name)?.data.Text

  if (!text) {
    if (noEmitError === true) return undefined
    else
      throw new Error(
        `Text section ${name} not found in ` +
          `the Airtable data specified. Does that ` +
          `query include the right tables, and ` +
          `does one of those tables include a ` +
          `section called ${name}?`
      )
  }

  if (replace && Object.keys(replace).length > 0) {
    let replaced = text
    Object.entries(replace).forEach(([placeholder, value]) => {
      replaced = replaced.replaceAll(placeholder, value)
    })
    return replaced
  }

  return text
}

export default getCMSText
