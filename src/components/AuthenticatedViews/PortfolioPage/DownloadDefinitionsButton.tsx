import DownloadIcon from 'components/ui/icons/DownloadIcon'
import MintButton from 'components/ui/MintButton'
import React from 'react'

import { useTheme } from 'styled-components'
import defaultColumns from '../../../../config/defaultColumns.json'

const DownloadDefinitionsButton = () => {
  const theme = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    let content = 'Column, Definition\n'
    for (const [key, value] of Object.entries(defaultColumns.columns)) {
      content += `${key}, ${value.definition}\n`
    }

    const fileName = 'Pharos Column Definitions.csv'

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
      Download column definitions
    </MintButton>
  )
}

export default DownloadDefinitionsButton
