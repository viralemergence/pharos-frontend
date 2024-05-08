import CMSText, {
  getCMSText,
  CMSTextProps,
} from 'components/library/airtable/cms-text'
import CMSIcon, {
  useCMSIcon,
  CMSIconProps,
  CMSIconProvider,
  CMSIconProviderProps,
} from 'components/library/airtable/cms-icon'
import CMSImage, {
  getCMSImage,
  CMSImageProps,
} from 'components/library/airtable/cms-image'
import CMSRichText, {
  RenderCMSRichText,
  parseCMSRichText,
} from 'components/library/airtable/cms-rich-text'
import CMSPlotIcon, {
  CMSPlotIconProps,
} from 'components/library/airtable/cms-plot-icon'
import CMSDownload, {
  CMSDownloadProps,
  getCMSDownloadInfo,
} from 'components/library/airtable/cms-download'
import SEO, {
  SEOProps,
  SiteMetadataContext,
  SiteMetadataProvider,
  SiteMetadataProviderProps,
} from 'components/library/airtable/cms-seo'

// AirtableCMSData type declaration
import type { AirtableCMSData } from 'components/library/airtable/cms-types'

export type {
  // query data type
  AirtableCMSData,
  // component prop types
  SEOProps,
  CMSTextProps,
  CMSIconProps,
  CMSImageProps,
  CMSDownloadProps,
  CMSPlotIconProps,
  CMSIconProviderProps,
  SiteMetadataProviderProps,
}

const CMS = {
  // components
  Image: CMSImage,
  Text: CMSText,
  RichText: CMSRichText,
  Icon: CMSIcon,
  PlotIcon: CMSPlotIcon,
  Download: CMSDownload,
  SEO,
  // non-AirtableCMSData components
  RenderRichText: RenderCMSRichText,
  // getters
  getImage: getCMSImage,
  getText: getCMSText,
  getDownloadInfo: getCMSDownloadInfo,
  // hooks
  useIcon: useCMSIcon,
  // utilities
  parseRichText: parseCMSRichText,
  // contexts
  IconProvider: CMSIconProvider,
  SiteMetadataProvider,
  SiteMetadataContext,
}

export default CMS
