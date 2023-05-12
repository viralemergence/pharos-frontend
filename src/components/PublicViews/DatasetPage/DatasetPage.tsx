import React from 'react'

import useDatasetID from 'hooks/dataset/useDatasetID'

const DatasetPage = () => {
  const datasetID = useDatasetID()

  return <p>Dataset Page: datasetID = {datasetID}</p>
}

export default DatasetPage
