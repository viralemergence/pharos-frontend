import SEO, { SEOProps } from './CMSSEO'
import SiteMetadataProvider, {
  SiteMetadataContext,
  SiteMetadataProviderProps,
} from './SiteMetadataContext'

declare global {
  interface Window {
    GATSBY_GTAG_PLUGIN_GA_TRACKING_ID?: string
  }
}

export type { SEOProps, SiteMetadataProviderProps }

export { SiteMetadataContext, SiteMetadataProvider }
export default SEO
