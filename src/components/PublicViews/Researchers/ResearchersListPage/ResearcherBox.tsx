import React from 'react'
import styled from 'styled-components'

import { ContentBoxStyles } from './ResearcherPageLayout'

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

const ResearcherSummaryLink = styled.a`
  ${ContentBoxStyles};
  text-decoration: none;

  &:hover > h2 {
    text-decoration: underline;
  }
`

const ResearcherSummary = ({ researcher, setFilters }: ResearcherBoxProps) => (
  <ResearcherSummaryLink
    interactive
    href={`/researchers/?researcherID=${researcher.researcherID}`}
    onClick={e => {
      e.preventDefault()
      setFilters({ researcherID: researcher.researcherID })
    }}
  >
    <Name>{researcher.name}</Name>
    <Organization>{researcher.organization}</Organization>
  </ResearcherSummaryLink>
)

export default ResearcherSummary
