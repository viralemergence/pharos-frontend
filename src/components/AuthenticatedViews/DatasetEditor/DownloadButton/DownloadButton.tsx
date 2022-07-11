import React from 'react'
import { useParams } from 'react-router-dom'

import useDataset from 'hooks/useDatset'
import { unparse } from 'papaparse'
import MintButton from 'components/ui/MintButton'

const downloadFile = (fileName: string, data: Blob) => {
  const downloadLink = document.createElement('a')
  downloadLink.download = fileName
  const url = URL.createObjectURL(data)
  downloadLink.href = url
  downloadLink.click()
  URL.revokeObjectURL(url)
}

const DownloadButton = () => {
  const { id: datasetID } = useParams()
  const dataset = useDataset(datasetID)

  const version = dataset?.versions?.[dataset.activeVersion]

  const disable = !version || !version.rows || version.rows.length === 0

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!version?.rows) return null

    const content = unparse(version.rows)
    downloadFile(
      `${dataset?.name} ${version.date}.csv`,
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
