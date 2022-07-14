import React from 'react'
import { useParams } from 'react-router-dom'

import { unparse } from 'papaparse'
import MintButton from 'components/ui/MintButton'
import useVersionRows from 'hooks/useVersionRows'
import useDataset from 'hooks/useDatset'

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

  const versionRows = useVersionRows(datasetID, 0)
  const versionDate = dataset?.versions[dataset.activeVersion]?.date ?? ''

  const disable = !versionRows || versionRows.length === 0

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!versionRows) return null

    const content = unparse(versionRows)
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
