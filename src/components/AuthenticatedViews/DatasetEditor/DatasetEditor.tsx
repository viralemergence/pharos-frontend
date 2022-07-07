import React, { useState } from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'
import useDatasets, { DatasetRow } from 'hooks/useDatasets'
import { useParams } from 'react-router-dom'
import { Content, TopBar } from '../ViewComponents'
import MintButton from 'components/ui/MintButton'
import Uploader from './Uploader/Uploader'
import DatasetGrid from './DataGrid/DataGrid'
import useUser from 'hooks/useUser'

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
}

const DatasetEditor = () => {
  const [user] = useUser()
  const [datasets, setDatasets] = useDatasets()
  const { id } = useParams()

  const [versionStatus, setVersionStatus] = useState(VersionStatus.unsaved)

  if (!id) throw new Error('Missing dataset ID url parameter')

  const dataset = datasets[id]

  if (!dataset) return <p>Loading dataset</p>

  const file = dataset.versions.slice(-1)[0].raw

  // const [file, setFile] = useState<DatasetRow[]>([])

  const setFile = (file: DatasetRow[]) => {
    setDatasets(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        versions: [
          ...prev[id].versions,
          { date: new Date().toISOString(), uri: '', raw: file },
        ],
      },
    }))
  }

  console.log(file)

  const saveVersion = async () => {
    setVersionStatus(VersionStatus.saving)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/upload-version`,
      {
        method: 'POST',
        body: `{
          "researcherID": "${user.data?.researcherID}",
          "datasetID": "${id},
          "raw": ${file}
        }`,
      }
    ).catch(error => console.log(error))

    if (!response) {
      console.log('network error')
      return undefined
    }

    setVersionStatus(VersionStatus.saved)
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
