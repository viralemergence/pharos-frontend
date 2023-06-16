import React from 'react'
import styled from 'styled-components'
import useProject from 'hooks/project/useProject'
import { commaSeparatedList } from 'utilities/grammar'
import { ProjectPublishStatusChip } from '../PublishingStatusChip'

const H2 = styled.h2`
  margin: 0;
  font-weight: normal;
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.darkGray};
  text-transform: uppercase;
  margin-bottom: 5px;
`
const P = styled.p`
  margin: 0;
  font-weight: normal;
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
  margin-bottom: 20px;
`
const Divider = styled.div`
  width: 100%;
  height: 0;
  border-bottom: 1px solid ${({ theme }) => theme.medGray};
  margin-bottom: 20px;
`

const ProjectInfoPanel = (): JSX.Element => {
  const project = useProject()

  const relatedMaterials = project.relatedMaterials
    ? commaSeparatedList(project.relatedMaterials)
    : '—'

  return (
    <>
      <H2>Project status</H2>
      <P>
        <ProjectPublishStatusChip status={project.publishStatus}>
          {project.publishStatus}
        </ProjectPublishStatusChip>
      </P>
      <H2>DOI</H2>
      <P>Not yet available</P>
      <H2>How to cite this project</H2>
      <P>{project.citation || '—'}</P>
      <Divider />
      <H2>Project type</H2>
      <P>{project.projectType || '—'}</P>
      <H2>Surveillance status</H2>
      <P>{project.surveillanceStatus || '—'}</P>
      <H2>Related materials</H2>
      <P>{relatedMaterials}</P>
    </>
  )
}

export default ProjectInfoPanel
