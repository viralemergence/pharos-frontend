import React from 'react'
import styled from 'styled-components'

import { ResearcherPageContentBox } from './ResearcherPageLayout'

import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'

interface ResearcherBoxProps {
  researcher: PublishedResearcher
}

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

const ResearcherBox = ({ researcher }: ResearcherBoxProps) => (
  <ResearcherPageContentBox interactive>
    <Name>{researcher.name}</Name>
    <Organization>{researcher.organization}</Organization>
  </ResearcherPageContentBox>
)

export default ResearcherBox
