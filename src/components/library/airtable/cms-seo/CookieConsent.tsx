import React, { useContext } from 'react'

import { getCMSText } from 'components/library/airtable/cms-text'
import { SiteMetadataContext } from './'

const CookieConsent = () => {
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
  const { data, trackingId } = siteMetadataContext

  // cookie consent stuff
  const cookieMessage = getCMSText(data, 'Cookie consent message'),
    buttonColor = getCMSText(data, 'Cookie consent button color'),
    backgroundColor = getCMSText(data, 'Cookie consent background color')

  return trackingId ? (
    <>
      <script
        src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
        data-cfasync="false"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
      /**
       * If consent is given for cookies, add gtag cookies
       * @method setupGA
       * @return {[type]} [description]
       */
      function setupGA(allowed) {
        if (!allowed) {
          window["ga-disable-${trackingId}"] = true;
        } else {
          window["ga-disable-${trackingId}"] = false;
          /**
           * Helper function for defining gtag cookies
           * @method gtag
           * @return {[type]} [description]
           */
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "${trackingId}");
        }
      }
      window.cookieconsent.initialise({
        palette: {
          popup: {
            background: "${backgroundColor}",
          },
          button: {
            background: "${buttonColor}",
          }
        },
        autoOpen: true,
        position: "bottom-right",
        type: "opt-in",
        content: {
          message: "${cookieMessage}"
        },
        hasTransition: false,
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-opt-out
        onInitialise: function(status) {
          var type = this.options.type;
          var didConsent = this.hasConsented();
          if (type == "opt-in" && didConsent) {
            // enable cookies
            setupGA(true);
          }
          if (type == "opt-out" && !didConsent) {
            // disable cookies
            setupGA(false);
          }
        },
        onStatusChange: function(status, chosenBefore) {
          var type = this.options.type;
          var didConsent = this.hasConsented();
          if (type == "opt-in" && didConsent) {
            // enable cookies
            setupGA(true);
          }
          if (type == "opt-out" && !didConsent) {
            // disable cookies
            setupGA(false);
          }
        },
        onRevokeChoice: function() {
          var type = this.options.type;
          if (type == "opt-in") {
            // disable cookies
            setupGA(false);
          }
          if (type == "opt-out") {
            // enable cookies
            setupGA(true);
          }
        }
      });`,
        }}
      />
    </>
  ) : (
    <></>
  )
}
export default CookieConsent
