import React from 'react'

import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'
import styled from 'styled-components'

interface ResearcherDetailProps {
  researcher: PublishedResearcher
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Name = styled.h2`
  ${({ theme }) => theme.h2};
  margin: 0;
`
const Organization = styled.h3`
  ${({ theme }) => theme.smallParagraph};
  margin: 25px 0 0 0;
`
const Email = styled.p`
  ${({ theme }) => theme.smallParagraph};
  margin: 5px 0 0 0;
`
const ProjectsHeader = styled.h3`
  ${({ theme }) => theme.smallParagraph};
  margin: 40px 0 0 0;
`

const ResearcherDetail = ({ researcher }: ResearcherDetailProps) => {
  return (
    <Container>
      <Name>{researcher.name}</Name>
      <Organization>{researcher.organization}</Organization>
      <Email>{researcher.email}</Email>
      <ProjectsHeader>Projects</ProjectsHeader>
    </Container>
  )
}

export default ResearcherDetail
