import React from 'react'
import parseCMSRichText from './parseCMSRichText'

export interface RenderCMSRichTextProps
  extends React.ComponentPropsWithRef<'div'> {
  /**
   * string containing raw markdown from
   * an airtable rich text column
   */
  markdown: string
}

const RenderCMSRichText = React.forwardRef<
  HTMLDivElement,
  RenderCMSRichTextProps
>(
  ({ markdown, ...props }, ref): JSX.Element => (
    <div
      {...props}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: parseCMSRichText(markdown) }}
    />
  )
)

export default RenderCMSRichText
