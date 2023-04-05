import React from 'react'

import Papa from 'papaparse'
import MintButton from 'components/ui/MintButton'

import useVersionedRows from 'hooks/register/useVersionedRows'
import useDataset from 'hooks/dataset/useDataset'
import { Datapoint } from 'reducers/stateReducer/types'
import { useTheme } from 'styled-components'

const downloadFile = (fileName: string, data: Blob) => {
  const downloadLink = document.createElement('a')

  downloadLink.download = fileName

  const url = URL.createObjectURL(data)
  downloadLink.href = url
  downloadLink.click()
  URL.revokeObjectURL(url)
}

const DownloadButton = () => {
  const dataset = useDataset()
  const theme = useTheme()

  const { rows, colNames } = useVersionedRows()
  const versionDate = new Date().toLocaleDateString()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    let content = ''

    if (!rows || rows.length === 0) content = colNames.join(',') + '\n,'
    else
      content = Papa.unparse(
        rows.map(row =>
          Object.entries(row)
            .filter(([key]) => key !== '_meta')
            .reduce(
              (obj, [key, value]) => ({
                ...obj,
                [key]: (value as unknown as Datapoint).dataValue,
              }),
              {}
            )
        ),
        { columns: colNames }
      )

    downloadFile(
      `${dataset?.name} ${versionDate}.csv`,
      new Blob([content], { type: 'text/csv;charset=utf-8;' })
    )
  }

  return (
    <MintButton secondary onClick={e => handleClick(e)}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        style={{ marginRight: 10 }}
      >
        <path
          fill={theme.black}
          d="M14.25 6.75H11.25V2.25H6.75V6.75H3.75L9 12L14.25 6.75ZM3.75 13.5V15H14.25V13.5H3.75Z"
        />
      </svg>
      Download CSV
    </MintButton>
  )
}

export default DownloadButton
