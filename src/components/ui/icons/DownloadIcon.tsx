import React from 'react'

interface DownloadIconProps extends React.HTMLProps<SVGSVGElement> {
  fill?: string
}

const DownloadIcon = ({ fill, ...props }: DownloadIconProps) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    style={{ marginRight: 10 }}
    {...props}
  >
    <path
      fill={fill}
      d="M14.25 6.75H11.25V2.25H6.75V6.75H3.75L9 12L14.25 6.75ZM3.75 13.5V15H14.25V13.5H3.75Z"
    />
  </svg>
)

export default DownloadIcon
