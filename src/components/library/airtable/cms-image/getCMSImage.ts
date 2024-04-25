import { getImage, IGatsbyImageData } from 'gatsby-plugin-image'

import { AirtableCMSData } from 'components/library/airtable/cms-types'

interface CMSImage {
  sources: IGatsbyImageData
  alt: string
  url: string | undefined
}

function getCMSImage(
  data: AirtableCMSData,
  name: string,
  noEmitError: true
): CMSImage | undefined
function getCMSImage(
  data: AirtableCMSData,
  name: string,
  noEmitError: boolean
): CMSImage | undefined
function getCMSImage(
  data: AirtableCMSData,
  name: string,
  noEmitError?: false
): CMSImage
function getCMSImage(
  data: AirtableCMSData,
  name: string,
  noEmitError: true | false | boolean | undefined
) {
  const image = data.nodes.find(i => i.data.Name === name)

  if (image?.data.Image) {
    const sources = getImage(image.data.Image.localFiles[0])

    const url =
      image.data.Image.localFiles[0].childImageSharp.gatsbyImageData.images
        .fallback?.src

    const alt = image?.data.Text

    if (sources && alt) return { sources, alt, url }
  }
  if (noEmitError) return undefined
  throw new Error(
    `Image ${name} not found in ` +
    `Airtable. Does the query include the ` +
    `right tables, and does one of those ` +
    `tables include a section called ${name}?.`
  )
}

export default getCMSImage
