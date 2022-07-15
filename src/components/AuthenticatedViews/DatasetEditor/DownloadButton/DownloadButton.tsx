import React from 'react'

import Papa from 'papaparse'
import MintButton from 'components/ui/MintButton'

import useVersionedRows from 'hooks/register/useVersionedRows'
import useDataset from 'hooks/dataset/useDataset'

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

  const versionRows = useVersionedRows()
  const versionDate = dataset?.versions[dataset.activeVersion]?.date ?? ''

  const disable = !versionRows || versionRows.length === 0

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!versionRows) return null

    const content = Papa.unparse(
      versionRows.map(row =>
        Object.entries(row).reduce(
          (obj, [key, value]) => ({ ...obj, [key]: value.displayValue }),
          {}
        )
      )
    )

    downloadFile(
      `${dataset?.name} ${versionDate}.csv`,
      new Blob([content], { type: 'text/csv;charset=utf-8;' })
    )
  }
  return (
    <MintButton
      secondary
      disabled={disable}
      style={{ marginLeft: 15 }}
      onClick={e => handleClick(e)}
    >
      Download CSV
    </MintButton>
  )
}

export default DownloadButton
