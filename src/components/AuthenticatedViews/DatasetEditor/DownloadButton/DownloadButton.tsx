import React from 'react'

import Papa from 'papaparse'

import useVersionedRows from 'hooks/register/useVersionedRows'
import useDataset from 'hooks/dataset/useDataset'
import { Datapoint } from 'reducers/stateReducer/types'
import { MintToolbarButton } from 'components/ui/MintToolbar/MintToolbar'
import DownloadIcon from 'components/ui/MintToolbar/MintToolbarIcons/DownloadIcon'

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
    <MintToolbarButton tooltip="Download CSV" onClick={e => handleClick(e)}>
      <DownloadIcon />
    </MintToolbarButton>
  )
}

export default DownloadButton
