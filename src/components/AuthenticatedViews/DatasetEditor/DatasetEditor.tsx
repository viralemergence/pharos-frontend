import React from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'
import useDatasets from 'hooks/useDatasets'
import { useParams } from 'react-router-dom'
import { Content, TopBar } from '../ViewComponents'
import MintButton from 'components/ui/MintButton'
import Uploader from './Uploader/Uploader'
import DatasetGrid from './DataGrid/DataGrid'
import useUser from 'hooks/useUser'

import { DatasetRow, DatasetsStatus } from 'reducers/datasetsReducer/types'

const H1 = styled.h1`
  ${({ theme }) => theme.h3};
  text-transform: uppercase;
  margin: 0;
`
const H2 = styled.h2`
  ${({ theme }) => theme.extraSmallParagraph};
  text-transform: uppercase;
`

enum VersionStatus {
  'unsaved',
  'saving',
  'saved',
  'error',
}

const DatasetEditor = () => {
  const [user] = useUser()
  const [datasets, datasetsDispatch] = useDatasets()
  const { id } = useParams()

  if (!id) throw new Error('Missing dataset ID url parameter')

  const dataset = datasets.datasets[id]

  if (datasets.status === DatasetsStatus.Loading) return <p>Loading dataset</p>

  const versionStatus = dataset.versions.slice(-1)[0].status

  const file = dataset.versions.slice(-1)[0]?.raw

  const setFile = (file: DatasetRow[]) => {
    setDatasets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        versions: [
          ...prev[id].versions,
          {
            date: '',
            uri: '',
            raw: file,
            status: VersionStatus.unsaved,
          },
        ],
      },
    }))
  }

  console.log(dataset)

  const saveVersion = async () => {
    setDatasets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        versions: [
          ...prev[id].versions,
          {
            ...prev[id].versions.slice(-1)[0],
            status: VersionStatus.saving,
          },
        ],
      },
    }))

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/upload-version`,
      {
        method: 'POST',
        body: JSON.stringify({
          researcherID: user.data?.researcherID,
          datasetID: id,
          raw: file,
        }),
      }
    ).catch(error => {
      setDatasets(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          versions: [
            ...prev[id].versions,
            {
              ...prev[id].versions.slice(-1)[0],
              status: VersionStatus.error,
            },
          ],
        },
      }))
      console.log(error)
    })

    if (!response) {
      setDatasets(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          versions: [
            ...prev[id].versions,
            {
              ...prev[id].versions.slice(-1)[0],
              status: VersionStatus.error,
            },
          ],
        },
      }))
      return undefined
    }

    setDatasets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        versions: [
          ...prev[id].versions,
          {
            ...prev[id].versions.slice(-1)[0],
            status: VersionStatus.saved,
          },
        ],
      },
    }))
  }

  let buttonMessage = 'Update dataset'
  switch (versionStatus) {
    case VersionStatus.saved:
      buttonMessage = 'Dataset saved'
      break
    case VersionStatus.saving:
      buttonMessage = 'Saving...'
      break
    case VersionStatus.unsaved:
      buttonMessage = 'Update dataset'
      break
    case VersionStatus.error:
      buttonMessage = 'Error'
  }

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <MintButton
            onClick={e => saveVersion()}
            disabled={
              versionStatus === VersionStatus.saved ||
              versionStatus === VersionStatus.saving
            }
          >
            {buttonMessage}
          </MintButton>
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
        {(!file || file?.length === 0) && <Uploader {...{ setFile }} />}
        <DatasetGrid file={file} />
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
