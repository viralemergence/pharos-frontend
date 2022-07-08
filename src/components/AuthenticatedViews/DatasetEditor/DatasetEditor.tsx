import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import {
  Record,
  DatasetStatus,
  VersionStatus,
} from 'reducers/projectReducer/types'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'

import Uploader from './Uploader/Uploader'
import DatasetGrid from './DataGrid/DataGrid'
import { Content, TopBar } from '../ViewComponents'

import useProject from 'hooks/useProject'
import UpdateButton from './UpdateButton/UpdateButton'

import loadVersionRaw from 'api/loadVersionRaw'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'

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
  const [project, projectDispatch] = useProject()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = project.datasets[id]

  console.log({ project })

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

  const versionKey = dataset?.versions?.[dataset.activeVersion].key

  useEffect(() => {
    const loadVersionContent = async () => {
      console.log(versionKey)
      if (!versionKey) return null

      const rows = await loadVersionRaw(id, versionKey)

      if (rows) {
        projectDispatch({
          type: ProjectActions.UpdateVersion,
          payload: {
            datasetID: id,
            version: {
              rows: rows as Record[],
            },
          },
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetVersionStatus,
          payload: {
            datasetID: id,
            status: VersionStatus.Error,
          },
        })
      }
    }

    if (versionKey) loadVersionContent()
  }, [id, versionKey, projectDispatch])

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
