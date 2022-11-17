import React from 'react'
import PropTypes from 'prop-types'

import { plugins } from '../gatsby-config'

export default function HTML(props) {
  const { trackingId } = plugins.find(
    p => typeof p !== 'string' && p.resolve === `gatsby-plugin-gtag`
  ).options

  if (trackingId === 'G-XXXXXXXXXX')
    console.warn(`Google Analytics not configured`)
  else console.info(`Google Analytics tag: ${trackingId}`)

  return (
    <html {...props.htmlAttributes} lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
        />
        {props.headComponents}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: ` 
              window.dataLayer = window.dataLayer || [];
              window["ga-disable-${trackingId}"] = true;`,
          }}
        />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
