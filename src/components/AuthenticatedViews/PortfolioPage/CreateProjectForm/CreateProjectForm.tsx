import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import Textarea from 'components/ui/Textarea'
import Typeahead from '../../../../../library/ui/typeahead/Typeahead'

import useDoCreateProject from 'reducers/stateReducer/hooks/useDoCreateProject'
import useModal from 'hooks/useModal/useModal'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'
import { Project, ProjectPublishStatus } from 'reducers/stateReducer/types'
import useDispatch from 'hooks/useDispatch'
import { useNavigate } from 'react-router-dom'
import generateID from 'utilities/generateID'
import useUser from 'hooks/useUser'
import getTimestamp from 'utilities/getTimestamp'
import { StateActions } from 'reducers/stateReducer/stateReducer'

const Section = styled.section`
  width: 800px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 15px 15px 15px;

  input {
    ${({ theme }) => theme.smallParagraph};
    &::placeholder {
      color: ${({ theme }) => theme.darkGray};
    }
  }
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3}
  margin-bottom: 0;
`
const AddMoreButton = styled.button`
  background: none;
  border: none;
  flex-grow: 0;
  margin-right: auto;
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
  margin-top: 10px;
`
// const DividerLine = styled.div`
//   border-bottom: 1px solid ${({ theme }) => theme.lightGray};
// `

const projectTypes = [
  { key: '1', label: 'Routine surveillance' },
  { key: '2', label: 'Opportunistic' },
  { key: '3', label: 'Event-based' },
  { key: '4', label: 'Archival' },
]

const surveillanceStatuses = [
  { key: '1', label: 'Ongoing' },
  { key: '2', label: 'Ended' },
]

export interface FormData {
  name: string
  description: string
  citation: string
  projectType: (typeof projectTypes)[number]['label']
  surveillanceStatus: (typeof surveillanceStatuses)[number]['label']
  relatedMaterials: string[]
  projectPublications: string[]
  othersCiting: string[]
}

export enum CreateProjectFormMode {
  New = 'new',
  Edit = 'edit',
}

interface NewCreateProjectFormProps {
  mode: CreateProjectFormMode.New
  project?: undefined
}

interface EditCreateProjectFormProps {
  mode: CreateProjectFormMode.Edit
  project: Project
}

type CreateProjectFormProps =
  | NewCreateProjectFormProps
  | EditCreateProjectFormProps

const CreateProjectForm = ({ mode, project }: CreateProjectFormProps) => {
  const user = useUser()
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const setModal = useModal()

  const [formMessage, setFormMessage] = useState('Project name cannot be blank')

  const [formData, setFormData] = useState<FormData>(
    mode === CreateProjectFormMode.New
      ? {
          name: '',
          description: '',
          projectType: '',
          citation: '',
          surveillanceStatus: '',
          relatedMaterials: [''],
          projectPublications: [''],
          othersCiting: [''],
        }
      : {
          name: project.name,
          description: project.description ?? '',
          projectType: project.projectType ?? '',
          citation: project.citation ?? '',
          surveillanceStatus: project.surveillanceStatus ?? '',
          relatedMaterials: project.relatedMaterials ?? [''],
          projectPublications: project.projectPublications ?? [''],
          othersCiting: project.othersCiting ?? [''],
        }
  )

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormMessage('')

    if (formData.name === '') {
      setFormMessage('Project name cannot be blank')
      return
    }

    if (mode === CreateProjectFormMode.New) {
      const projectID = generateID.projectID()
      const projectData = {
        ...formData,
        projectID,
        authors: [
          {
            researcherID: user.researcherID,
            role: 'owner',
          },
        ],
        datasetIDs: [],
        lastUpdated: getTimestamp(),
        publishStatus: ProjectPublishStatus.Unpublished,
      }

      dispatch({
        type: StateActions.CreateProject,
        payload: projectData,
      })

      navigate(`/projects/${projectID}`)
    }
    if (mode === CreateProjectFormMode.Edit) {
      alert('save project')
    }

    setModal(null)
  }

  const updateProjectData = (
    value: string,
    key: keyof typeof formData,
    index = 0
  ) => {
    if (key === 'name')
      if (value === '') setFormMessage('Project name cannot be blank')
      else setFormMessage('')

    setFormData(prev => {
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

  return (
    <Section>
      <H1>
        {mode === CreateProjectFormMode.New ? 'New Project' : 'Edit Project'}
      </H1>

      <Label htmlFor="Name">Project name *</Label>
      <Input
        id="Name"
        name="Name"
        type="text"
        autoFocus
        value={formData.name}
        onChange={e => updateProjectData(e.target.value, 'name')}
        placeholder="Project name"
      />

      <Label htmlFor="Project type">Project type</Label>
      <Typeahead
        inputId="Project type"
        items={projectTypes}
        placeholder="Project type"
        placeholderColor={theme.darkGray}
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        style={{ boxShadow: 'none' }}
        onAdd={item => updateProjectData(item.label, 'projectType')}
        values={projectTypes.filter(
          item => item.label === formData.projectType
        )}
      />

      <Label htmlFor="Surveillance status">Surveillance status</Label>
      <Typeahead
        inputId="Surveillance status"
        items={surveillanceStatuses}
        placeholder="Surveillance status"
        placeholderColor={theme.darkGray}
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        onAdd={item => updateProjectData(item.label, 'surveillanceStatus')}
        style={{ boxShadow: 'none' }}
        values={surveillanceStatuses.filter(
          item => item.label === formData.surveillanceStatus
        )}
      />

      <Label htmlFor="Related materials">Related material</Label>
      {formData.relatedMaterials.map((string, index) => (
        <Input
          key={index}
          type="text"
          name="Related materials"
          value={string}
          onChange={e =>
            updateProjectData(e.target.value, 'relatedMaterials', index)
          }
          placeholder="e.g. github link"
        />
      ))}
      {formData.relatedMaterials.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              relatedMaterials: [...prev.relatedMaterials, ''],
            }))
          }
        >
          + Add another
        </AddMoreButton>
      )}

      <Label htmlFor="Description">Description</Label>
      <Textarea
        id="Description"
        value={formData.description}
        onChange={e => updateProjectData(e.target.value, 'description')}
        placeholder="Description of the project"
      />

      <Label htmlFor="Your project publications">Project publications</Label>
      {formData.projectPublications.map((string, index) => (
        <Textarea
          key={index}
          id="Your project publications"
          name="Your project publications"
          value={string}
          onChange={e =>
            updateProjectData(e.target.value, 'projectPublications', index)
          }
          placeholder="Publications by the researcher about this project"
        />
      ))}
      {formData.projectPublications.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              projectPublications: [...prev.projectPublications, ''],
            }))
          }
        >
          + Add another
        </AddMoreButton>
      )}

      <Label htmlFor="Other projects citing">
        Publications citing this project
      </Label>
      {formData.othersCiting.map((string, index) => (
        <Textarea
          key={index}
          id="Other projects citing"
          name="Other projects citing"
          value={string}
          onChange={e =>
            updateProjectData(e.target.value, 'othersCiting', index)
          }
          placeholder="Publications by other researchers that reference this project"
        />
      ))}
      {formData.othersCiting.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              othersCiting: [...prev.othersCiting, ''],
            }))
          }
        >
          + Add another
        </AddMoreButton>
      )}

      {formMessage && (
        <ColorMessage status={ColorMessageStatus.Danger}>
          {formMessage}
        </ColorMessage>
      )}

      <MintButton
        onClick={handleSubmit}
        style={{ marginRight: 'auto', marginTop: 30 }}
        disabled={formData.name === ''}
      >
        {mode === CreateProjectFormMode.New && 'Create new project'}
        {mode === CreateProjectFormMode.Edit && 'Save changes'}
      </MintButton>
    </Section>
  )
}

export default CreateProjectForm
