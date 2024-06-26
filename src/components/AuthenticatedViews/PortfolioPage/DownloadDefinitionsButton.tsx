import React from 'react'
import Papa from 'papaparse'

import DownloadIcon from 'components/ui/icons/DownloadIcon'
import MintButton from 'components/ui/MintButton'

import { useTheme } from 'styled-components'
import defaultColumns from 'config/defaultColumns'

const DownloadDefinitionsButton = () => {
  const theme = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const columns = ['Column', 'Definition']
    const rows = Object.entries(defaultColumns).map(([key, value]) => ({
      Column: key,
      Definition: value.definition,
    }))

    const content = Papa.unparse(rows, { columns })

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
