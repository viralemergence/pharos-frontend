import React from 'react'

import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'
import styled, { useTheme } from 'styled-components'
import { Link } from 'gatsby'
import { ResearcherPageContentBox } from './ResearcherPageLayout'
import formatDate from 'utilities/formatDate'

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
const ProjectsHeader = styled.h3`
  ${({ theme }) => theme.smallParagraph};
  margin: 40px 0 0 0;
`
const ProjectSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
`
const DatePublished = styled.p`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
`
const ProjectName = styled.h4`
  ${({ theme }) => theme.h3};
  margin: 10px 0 5px 0;

  > a {
    color: ${({ theme }) => theme.white};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`
const ProjectResearcherAuthors = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const ProjectResearcherAuthor = styled(Link)`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.white};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ResearcherDetail = ({ researcher }: ResearcherDetailProps) => {
  console.log(researcher)
  const theme = useTheme()
  return (
    <Container>
      <Name>{researcher.name}</Name>
      <Organization>{researcher.organization}</Organization>
      <ProjectsHeader>Projects</ProjectsHeader>
      <ProjectSection>
        {researcher.projects.map(project => (
          <ResearcherPageContentBox
            key={project.projectID}
            style={{ backgroundColor: theme.mutedPurple1 }}
          >
            <DatePublished>{formatDate(project.datePublished)}</DatePublished>
            <ProjectName>
              <Link to={`/projects/#/${project.projectID}`}>
                {project.name}
              </Link>
            </ProjectName>
            <ProjectResearcherAuthors>
              {project.authors.map(author => (
                <ProjectResearcherAuthor
                  key={author.researcherID}
                  to={`/researchers/?researcherID=${author.researcherID}`}
                >
                  {author.name}
                </ProjectResearcherAuthor>
              ))}
            </ProjectResearcherAuthors>
          </ResearcherPageContentBox>
        ))}
      </ProjectSection>
    </Container>
  )
}

export default ResearcherDetail
