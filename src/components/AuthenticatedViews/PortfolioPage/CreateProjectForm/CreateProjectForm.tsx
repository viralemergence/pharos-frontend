import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import useUser from 'hooks/useUser'
import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import Textarea from 'components/ui/Textarea'
import Typeahead from '@talus-analytics/library.ui.typeahead'
import generateID from 'utilities/generateID'
import saveProject from 'api/saveProject'
import { ProjectStatus } from 'reducers/projectReducer/types'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useProject from 'hooks/project/useProject'
import { useNavigate } from 'react-router-dom'

const Section = styled.section`
  width: 800px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 15px 15px 15px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3}
`
const AddMoreButton = styled.button`
  background: none;
  border: none;
  flex-grow: 0;
  margin-right: auto;
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
  margin-top: -20px;
`
const DividerLine = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.lightGray};
`

const projectTypes = [
  { key: '1', label: 'Routine surveillance' },
  { key: '2', label: 'Opportunistic' },
  { key: '3', label: 'Event-based' },
  { key: '4', label: 'Archival' },
]

const surveillanceTypes = [
  { key: '1', label: 'Active' },
  { key: '2', label: 'Passive' },
]

const surveillanceStatuses = [
  { key: '1', label: 'Ongoing' },
  { key: '2', label: 'Ended' },
]

const CreateProjectForm = () => {
  const user = useUser()
  const project = useProject()
  const projectDispatch = useProjectDispatch()
  const [formMessage, setFormMessage] = useState('')
  const theme = useTheme()

  const navigate = useNavigate()

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    projectType: '',
    citation: '',
    surveillanceType: '',
    surveillanceStatus: '',
    relatedMaterials: [''],
    publicationsCiting: [''],
  })

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(projectData)

    const projectID = generateID.projectID()

    if (!user.data?.researcherID) throw new Error('Researcher ID undefined')

    const saveData = {
      ...projectData,
      status: ProjectStatus.Saving,
      projectID,
      authors: [
        {
          researcherID: user.data.researcherID,
          role: 'owner',
        },
      ],
      datasetIDs: [],
      datasets: {},
    }

    projectDispatch({
      type: ProjectActions.SetProjectStatus,
      payload: ProjectStatus.Saving,
    })

    const saved = await saveProject(saveData)

    if (saved) {
      const project = {
        ...saveData,
        status: ProjectStatus.Saved,
      }

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: project,
      })

      navigate(`project/${projectID}`)
    } else {
      projectDispatch({
        type: ProjectActions.SetProjectStatus,
        payload: ProjectStatus.Error,
      })
    }
  }

  const updateProjectData = (
    value: string,
    key: keyof typeof projectData,
    index = 0
  ) => {
    setProjectData(prev => {
      // if the type of state is just a string, replace it
      if (typeof prev[key] === 'string') return { ...prev, [key]: value }

      // if it's an array and there's new text,
      // or if it's the only input in the array,
      // update it in its position in the array
      if (value || prev[key].length === 1)
        return {
          ...prev,
          [key]: [
            ...prev[key].slice(0, index),
            value,
            ...prev[key].slice(index + 1),
          ],
        }

      // if it's an array, and not the only one,
      // and the new value has no text, remove that input
      return {
        ...prev,
        [key]: [...prev[key].slice(0, index), ...prev[key].slice(index + 1)],
      }
    })
  }

  let buttonMessage
  switch (true) {
    // case !project.status:
    //   buttonMessage = 'Create project'
    //   break

    case project.status === ProjectStatus.Saving:
      buttonMessage = 'Saving...'
      break
    case project.status === ProjectStatus.Saved:
      buttonMessage = 'Saved'
      break
    default:
      buttonMessage = 'Create project'
      break
  }

  return (
    <Section>
      <H1>Create Project</H1>
      <Label>
        Project name
        <Input
          type="text"
          name="name"
          autoFocus
          value={projectData.name}
          onChange={e => updateProjectData(e.target.value, 'name')}
        />
      </Label>
      <Label>
        Description
        <Textarea
          value={projectData.description}
          onChange={e => updateProjectData(e.target.value, 'description')}
        />
      </Label>
      <Label style={{ margin: '0px 0px -15px 0px' }}>Project type</Label>
      <Typeahead
        items={projectTypes}
        placeholder="Project type"
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        onAdd={item => updateProjectData(item.label, 'projectType')}
        values={projectTypes.filter(
          item => item.label === projectData.projectType
        )}
      />
      <Label style={{ margin: '15px 0px -15px 0px' }}>Surveillance type</Label>
      <Typeahead
        items={surveillanceTypes}
        placeholder="Surveillance type"
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        onAdd={item => updateProjectData(item.label, 'surveillanceType')}
        values={surveillanceTypes.filter(
          item => item.label === projectData.surveillanceType
        )}
      />
      <Label style={{ margin: '15px 0px -15px 0px' }}>
        Surveillance status
      </Label>
      <Typeahead
        style={{ marginBottom: 15 }}
        items={surveillanceStatuses}
        placeholder="Surveillance status"
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        onAdd={item => updateProjectData(item.label, 'surveillanceStatus')}
        values={surveillanceStatuses.filter(
          item => item.label === projectData.surveillanceStatus
        )}
      />

      <Label>
        Cite this project
        <Textarea
          name="citation"
          onChange={e => updateProjectData(e.target.value, 'citation')}
        />
      </Label>
      <Label>
        Related materials
        {projectData.relatedMaterials.map((string, index) => (
          <Input
            key={index}
            type="text"
            name="name"
            value={string}
            onChange={e =>
              updateProjectData(e.target.value, 'relatedMaterials', index)
            }
          />
        ))}
      </Label>
      {projectData.relatedMaterials.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setProjectData(prev => ({
              ...prev,
              relatedMaterials: [...prev.relatedMaterials, ''],
            }))
          }
        >
          + Add more related laterial
        </AddMoreButton>
      )}
      <DividerLine />
      <Label>
        Publications citing this project
        {projectData.publicationsCiting.map((string, index) => (
          <Input
            key={index}
            type="text"
            name="name"
            value={string}
            onChange={e =>
              updateProjectData(e.target.value, 'publicationsCiting', index)
            }
          />
        ))}
      </Label>
      {projectData.publicationsCiting.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setProjectData(prev => ({
              ...prev,
              publicationsCiting: [...prev.publicationsCiting, ''],
            }))
          }
        >
          + Add more related material
        </AddMoreButton>
      )}
      <p style={{ margin: 0, padding: 0 }}>{formMessage}</p>
      <MintButton onClick={handleSubmit} style={{ marginLeft: 'auto' }}>
        {buttonMessage}
      </MintButton>
    </Section>
  )
}

export default CreateProjectForm
