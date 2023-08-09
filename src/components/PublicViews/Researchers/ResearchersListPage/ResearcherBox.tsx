import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'
import React from 'react'
import { ResearcherPageContentBox } from './ResearcherPageLayout'

interface ResearcherBoxProps {
  researcher: PublishedResearcher
}

const ResearcherBox = ({ researcher }: ResearcherBoxProps) => (
  <ResearcherPageContentBox interactive>
    <h3>{researcher.name}</h3>
    <p>{researcher.organization}</p>
  </ResearcherPageContentBox>
)

export default ResearcherBox
