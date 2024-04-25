import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from '@reach/router'
import { getCMSText } from 'components/library/airtable/cms-text'
import { getCMSImage } from 'components/library/airtable/cms-image'

import { SiteMetadataContext } from './'

export interface SEOProps {
  /**
   * Custom title for page, to be interpolated into the SEO title template
   */
  title?: string
  /**
   * Custom description for page
   */
  description?: string
  /**
   * Custom social image for page, use getCMSImage(data, 'SEO image').url
   * from components/library/airtable/cms-image package
   * (preferred) or directly provide a public image URL
   */
  imageUrl?: string
  /**
   * Set true if page fits the "article" Open Graph type
   */
  article?: boolean
  /**
   * Set true if you'd like to suppress errors on a missing Default title,
   * Title template, Default description, or Site URL field from the
   * "Site metadata" table in Airtable (eg. if you just want to define
   * a description meta tag on a page, but not others for some reason)
   */
  noEmitError?: boolean
}
const SEO = ({
  title,
  description,
  imageUrl,
  article,
  noEmitError = false,
}: SEOProps) => {
  const { pathname } = useLocation()
  const siteMetadataContext = useContext(SiteMetadataContext)

  // check for context provider
  if (siteMetadataContext === null) {
    throw new Error(
      'No data found in SiteMetadataContext. Does a parent component ' +
        '(most likely <Layout /> or <Providers />) include the ' +
        '<SiteMetadataProvider /> component, and is that component ' +
        'passed a result from the useSiteMetadata() hook?'
    )
  }

  // extract data from context
  const { data } = siteMetadataContext

  // throw error if no site metadata table exists
  if (Object.keys(data).length === 0 || data.nodes.length === 0) {
    throw new Error(
      `Problem querying "Site metadata" table` +
        `from Airtable. Does a table titled "Site metadata" exist?`
    )
  }

  const defaults = {
    title: getCMSText(data, 'Default title', noEmitError),
    titleTemplate: getCMSText(data, 'Title template', noEmitError),
    description: getCMSText(data, 'Default description', noEmitError),
    // image might be undefined and that's okay,
    // image meta tags simply won't render if that's the case
    // (getCMSImage is suppressing errors)
    image: getCMSImage(data, 'Default image', true)?.url,
    siteUrl: getCMSText(data, 'Site URL', noEmitError),
    // twitter username might be undefined and that's okay,
    // that meta tag simply won't render if that's the case
    // (getCMSText is suppressing errors)
    twitterUsername: getCMSText(data, 'Twitter username', true),
  }

  const seo = {
    // title could intentionally be undefined, in which case
    // default title will be applied
    title: title,
    description: description || defaults.description,
    image: imageUrl || defaults.image,
    url: `${defaults.siteUrl}${pathname}`,
  }

  return (
    <Helmet
      /* If title is defined, title template will kick in */
      /* Otherwise, default title is applied */
      title={seo.title}
      titleTemplate={defaults.titleTemplate}
      defaultTitle={defaults.title}
    >
      {/* Default meta tags */}
      <meta name="description" content={seo.description} />
      {seo.image && <meta name="image" content={seo.image} />}

      {/* Open Graph */}
      {seo.url && <meta property="og:url" content={seo.url} />}
      {article && <meta property="og:type" content="article" />}
      {(seo.title || defaults.title) && (
        <meta property="og:title" content={seo.title || defaults.title} />
      )}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {defaults.twitterUsername && (
        <meta name="twitter:creator" content={defaults.twitterUsername} />
      )}
      {(seo.title || defaults.title) && (
        <meta name="twitter:title" content={seo.title || defaults.title} />
      )}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {seo.image && (
        <meta
          name="twitter:image"
          content={(defaults.siteUrl || '') + seo.image}
        />
      )}
    </Helmet>
  )
}
export default SEO
