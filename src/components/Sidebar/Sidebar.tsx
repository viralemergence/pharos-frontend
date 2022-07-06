import React from 'react'
import styled from 'styled-components'

import { Link } from 'react-router-dom'

import useUser from 'hooks/useUser'
import useDatasets from 'hooks/useDatasets'

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

const Sidebar = () => {
  const [user] = useUser()
  const [datasets] = useDatasets()

  return (
    <Container>
      <Name to={'/'}>{user.data?.name}</Name>
      <ResearcherID>Researcher ID: {user.data?.researcherID}</ResearcherID>
      <Organization>{user.data?.organization}</Organization>
      <ul>
        {Object.entries(datasets).map(([id, dataset]) => (
          <li>
            <Link style={{ color: 'white' }} to={`/dataset/${id}`}>
              {dataset.name}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default Sidebar
