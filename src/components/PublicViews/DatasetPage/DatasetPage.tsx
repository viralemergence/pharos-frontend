import React from 'react'

import PublicViewBackground from '../PublicViewBackground'

import useDatasetID from 'hooks/dataset/useDatasetID'
import { DatasetPageMain } from 'components/DatasetPage/DatasetPageLayout'

const DatasetPage = () => {
  const datasetID = useDatasetID()

  return (
    <>
      <PublicViewBackground />
      <DatasetPageMain>
        <p>Dataset Page: datasetID = {datasetID}</p>
      </DatasetPageMain>
    </>
  )
}

export default DatasetPage
