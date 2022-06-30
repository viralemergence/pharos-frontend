import React from 'react'
import styled from 'styled-components'

import useUser from 'hooks/useUser'

const Container = styled.div`
  /* position: sticky;
  top: 0;
  offset: 0;
  width: 340px;
  height: 100vh; */
  background-color: ${({ theme }) => theme.darkPurpleWhiter};
  display: flex;
  flex-direction: column;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  color: white;
  padding: 20px;
`
const Name = styled.div`
  font-size: 30px;
  line-height: 45px;
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
  color: ${({ theme }) => theme.medGray};
  border-bottom: 1px solid white;
  padding-bottom: 15px;
`

const Sidebar = () => {
  const [user] = useUser()

  return (
    <Container>
      <Name>{user.data?.name}</Name>
      <ResearcherID>Researcher ID: {user.data?.researcherID}</ResearcherID>
      <Organization>{user.data?.organization}</Organization>
    </Container>
  )
}

export default Sidebar
