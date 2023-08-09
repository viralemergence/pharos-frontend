import React from 'react'
import styled from 'styled-components'

import { ResearcherPageContentBox } from './ResearcherPageLayout'

import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'
import { Link } from 'react-router-dom'

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
    <Link to={`/${researcher.researcherID}`}>
      <Name>{researcher.name}</Name>
      <Organization>{researcher.organization}</Organization>
    </Link>
  </ResearcherPageContentBox>
)

export default ResearcherBox
