import React from 'react'
import styled from 'styled-components'

import { Link } from 'react-router-dom'

import useUser from 'hooks/useUser'
import useProject from 'hooks/useProject'

const Container = styled.div`
  background-color: ${({ theme }) => theme.darkPurpleWhiter};
  display: flex;
  flex-direction: column;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  color: white;
  padding: 20px;
`
const Name = styled(Link)`
  font-size: 30px;
  line-height: 45px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  color: white;
  text-decoration: none;
`
const ResearcherID = styled.div`
  margin-top: 15px;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.medGray};
  text-transform: uppercase;
`
const Organization = styled.div`
  margin-top: 15px;
  font-size: 20px;
  line-height: 30px;
  border-bottom: 1px solid white;
  padding-bottom: 15px;
`
const DatasetsHeader = styled(Link)`
  margin-top: 15px;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  text-transform: uppercase;
  font-family: 'Poppins';
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 20px;
`
const Dataset = styled.li`
  ${({ theme }) => theme.gridText};

  > a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Sidebar = () => {
  const user = useUser()
  const [project] = useProject()

  return (
    <Container>
      <Name to={'/'}>{user.data?.name}</Name>
      <ResearcherID>Researcher ID: {user.data?.researcherID}</ResearcherID>
      <Organization>{user.data?.organization}</Organization>
      <DatasetsHeader to={'/'}>Datasets</DatasetsHeader>
      <List>
        {Object.entries(project.datasets).map(([id, dataset]) => (
          <Dataset key={dataset.datasetID}>
            <Link style={{ color: 'white' }} to={`/dataset/${id}`}>
              {dataset.name}
            </Link>
          </Dataset>
        ))}
      </List>
    </Container>
  )
}

export default Sidebar
