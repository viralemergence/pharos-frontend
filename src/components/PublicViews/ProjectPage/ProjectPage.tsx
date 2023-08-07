import React from 'react'

import { ProjectPageLayout } from 'components/ProjectPage/ProjectPageLayout'

import PublicViewBackground from '../PublicViewBackground'

import useProjectID from 'hooks/project/useProjectID'

const ProjectPage = () => {
  const projectID = useProjectID()

  return (
    <>
      <PublicViewBackground />
      <ProjectPageLayout>
        <TopBar darkmode>
          <Breadcrumbs>
            <PublicViewBreadcrumbLink to={`/data/`}>
              All data
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink to={`/data/`}>
              Projects
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink
              $active
              to={`/projects/#/${project.projectID}`}
            >
              {status === ProjectDataStatus.Loaded
                ? project.name
                : 'Loading...'}
            </PublicViewBreadcrumbLink>
          </Breadcrumbs>
          <Title>
            {status === ProjectDataStatus.Loaded ? project.name : 'Loading...'}
          </Title>
          <Controls>
            {user.status === UserStatus.loggedIn &&
              user.data?.projectIDs?.includes(project.projectID) && (
                <MintButtonLink to={`/app/#/projects/${project.projectID}`}>
                  Manage project
                </MintButtonLink>
              )}
          </Controls>
        </TopBar>
        <ProjectPageMain>
          <PublicProjectPageContentBox>
            <h2>Description</h2>
            <p>
              {status === ProjectDataStatus.Loaded
                ? project.description
                : '...'}
            </p>
          </PublicProjectPageContentBox>
          {
            // <PublicProjectPageContentBox interactive>
            // <div
            //   style={{
            //     height: 400,
            //     display: 'flex',
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //     color: 'darkgray',
            //     fontStyle: 'italic',
            //   }}
            // >
            //   Map placeholder
            // </div>
            // </PublicProjectPageContentBox>
          }
          <DatasetsTable
            publicView={true}
            project={project}
            datasets={
              status === ProjectDataStatus.Loaded ? project.datasets : []
            }
          />
          {status === ProjectDataStatus.Loading ||
            (status === ProjectDataStatus.Loaded &&
              (project.citation ||
                (project.othersCiting && project.othersCiting.length > 0) ||
                (project.projectPublications &&
                  project.projectPublications.length > 0)) && (
                <PublicProjectPageContentBox>
                  {status === ProjectDataStatus.Loaded && (
                    <CitationsPublications project={project} published />
                  )}
                </PublicProjectPageContentBox>
              ))}
        </ProjectPageMain>
        <ProjectPageSidebar>
          <PublicProjectPageContentBox>
            {status === ProjectDataStatus.Loaded ? (
              <>
                <h2>{project.authors.length === 1 ? 'Author' : 'Authors'}</h2>
                {project.authors.map(author => (
                  <Author key={author.name}>
                    <AuthorName>{author.name}</AuthorName>
                    <AuthorOrganization>
                      {author.organization}
                    </AuthorOrganization>
                  </Author>
                ))}
              </>
            ) : (
              <h2>Authors</h2>
            )}
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            {status === ProjectDataStatus.Loaded ? (
              <>
                <h2>Permanent project link</h2>
                <ClickToCopy
                  darkmode
                  copyContentString={`${window.location.origin}/projects/#/${project.projectID}`}
                  style={{ marginTop: 10 }}
                >
                  {window.location.hostname}/projects/#/{project.projectID}
                </ClickToCopy>
                <h2>Project published</h2>
                <p>{formatDate(project.datePublished)}</p>
                {project.relatedMaterials &&
                  project.relatedMaterials.length > 0 && (
                    <>
                      <h2>Related materials</h2>
                      {project.relatedMaterials.map(material => (
                        <p key={material}>{material}</p>
                      ))}
                    </>
                  )}
                {project.projectType && (
                  <>
                    <h2>Project type</h2>
                    <p>{project.projectType || '—'}</p>
                  </>
                )}
                {project.surveillanceStatus && (
                  <>
                    <h2>Surveillance status</h2>
                    <p>{project.surveillanceStatus || '—'}</p>
                  </>
                )}
              </>
            ) : (
              <h2>Project published</h2>
            )}
          </PublicProjectPageContentBox>
        </ProjectPageSidebar>
      </ProjectPageLayout>
    </>
  )
}

export default ProjectPage
