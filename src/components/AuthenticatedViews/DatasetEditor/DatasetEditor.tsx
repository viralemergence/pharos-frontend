import React from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'
import useDatasets, { DatasetRow } from 'hooks/useDatasets'
import { useParams } from 'react-router-dom'
import { Content, TopBar } from '../ViewComponents'
import MintButton from 'components/ui/MintButton'
import Uploader from './Uploader/Uploader'
import DatasetGrid from './DataGrid/DataGrid'

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
  const [datasets, setDatasets] = useDatasets()
  const { id } = useParams()

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

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <MintButton>Update Dataset</MintButton>
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
        {(!file || file?.length === 0) && <Uploader {...{ setFile }} />}
        <DatasetGrid file={file} />
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
