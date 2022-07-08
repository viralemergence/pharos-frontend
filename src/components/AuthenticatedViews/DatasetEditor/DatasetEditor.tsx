import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import {
  DatasetRow,
  DatasetStatus,
  VersionStatus,
} from 'reducers/datasetsReducer/types'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'

import Uploader from './Uploader/Uploader'
import DatasetGrid from './DataGrid/DataGrid'
import { Content, TopBar } from '../ViewComponents'

import useDatasets from 'hooks/useDatasets'
import UpdateButton from './UpdateButton/UpdateButton'

import loadVersionRaw from 'api/loadVersionRaw'

import { DatasetsActions } from 'reducers/datasetsReducer/datasetsReducer'

const H1 = styled.h1`
  ${({ theme }) => theme.h3};
  text-transform: uppercase;
  margin: 0;
`
const H2 = styled.h2`
  ${({ theme }) => theme.extraSmallParagraph};
  text-transform: uppercase;
`

const DatasetEditor = () => {
  const { id } = useParams()
  const [datasets, datasetsDispatch] = useDatasets()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = datasets.datasets[id]

  console.log({ datasets })

  const datasetStatus = dataset?.status ? dataset.status : DatasetStatus.Unsaved

  let datasetStatusMessage = 'Error'
  switch (datasetStatus) {
    case DatasetStatus.Saved:
      datasetStatusMessage = 'Dataset saved'
      break
    case DatasetStatus.Saving:
      datasetStatusMessage = 'Saving...'
      break
    case DatasetStatus.Unsaved:
      datasetStatusMessage = 'Dataset not saved'
      break
    case DatasetStatus.Error:
      datasetStatusMessage = 'Error'
  }

  const versionKey = dataset?.versions?.[dataset.activeVersion].uri

  useEffect(() => {
    const loadVersionContent = async () => {
      console.log(versionKey)
      if (!versionKey) return null

      const raw = await loadVersionRaw(id, versionKey)

      if (raw) {
        const rows = raw as DatasetRow[]
        datasetsDispatch({
          type: DatasetsActions.UpdateVersion,
          payload: {
            datasetID: id,
            version: {
              raw: rows,
            },
          },
        })
      } else {
        datasetsDispatch({
          type: DatasetsActions.SetVersionStatus,
          payload: {
            datasetID: id,
            status: VersionStatus.Error,
          },
        })
      }
    }

    if (versionKey) loadVersionContent()
  }, [id, versionKey, datasetsDispatch])

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <UpdateButton />
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
        <H2>{datasetStatusMessage}</H2>
        <Uploader />
        <DatasetGrid />
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
