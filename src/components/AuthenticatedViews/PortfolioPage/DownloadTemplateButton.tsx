import DownloadIcon from 'components/ui/icons/DownloadIcon'
import MintButton from 'components/ui/MintButton'
import React from 'react'

import { useTheme } from 'styled-components'
import defaultColumns from '../../../../config/defaultColumns.json'

const DowloadTemplateButton = () => {
  const theme = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const content = Object.keys(defaultColumns.columns).join(',') + '\n,'
    const fileName = 'Pharos Datatset Template.csv'

    const downloadLink = document.createElement('a')

    downloadLink.download = fileName

    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/csv;charset=utf-8;' })
    )
    downloadLink.href = url
    downloadLink.click()
    URL.revokeObjectURL(url)
  }

  return (
    <MintButton secondary onClick={handleClick}>
      <DownloadIcon fill={theme.black} />
      Download dataset template
    </MintButton>
  )
}

export default DowloadTemplateButton
