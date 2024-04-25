import CMSRichText from './CMSRichText'
import RenderCMSRichText from './RenderCMSRichText'
import parseCMSRichText from './parseCMSRichText'

export {
  // react component taking a markdown
  // string and returning a div
  // containing the rendered html
  RenderCMSRichText,
  // helper function which takes
  // a string of markdown and
  // returns a string of HTML
  parseCMSRichText,
}

export default CMSRichText
