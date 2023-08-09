import React from 'react'
import styled from 'styled-components'

import { ResearcherButton } from './ResearcherPageLayout'

import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'
import { PublishedResearchersFilters } from 'hooks/researchers/usePublishedResearchers'

const Name = styled.h2`
  ${({ theme }) => theme.h2};
  color: ${({ theme }) => theme.white};
  margin: 10px 0;
`
const Organization = styled.p`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.white};
  margin: 0;
`

interface ResearcherBoxProps {
  researcher: PublishedResearcher
  setFilters: React.Dispatch<React.SetStateAction<PublishedResearchersFilters>>
}

const ResearcherSummary = ({ researcher, setFilters }: ResearcherBoxProps) => (
  <ResearcherButton
    onClick={() => setFilters({ researcherID: researcher.researcherID })}
  >
    <Name>{researcher.name}</Name>
    <Organization>{researcher.organization}</Organization>
  </ResearcherButton>
)

export default ResearcherSummary
