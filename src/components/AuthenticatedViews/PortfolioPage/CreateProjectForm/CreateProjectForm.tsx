import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { ProjectStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import Textarea from 'components/ui/Textarea'
import Typeahead from '@talus-analytics/library.ui.typeahead'

import useProject from 'hooks/project/useProject'
import useDoCreateProject from 'reducers/projectReducer/hooks/useDoCreateProject'

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
  projectType: typeof projectTypes[0]['label']
  surveillanceStatus: typeof surveillanceStatuses[0]['label']
  relatedMaterials: string[]
  projectPublications: string[]
  othersCiting: string[]
}

const CreateProjectForm = () => {
  const project = useProject()
  const doCreateProject = useDoCreateProject()
  const [formMessage, setFormMessage] = useState('')
  const theme = useTheme()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    projectType: '',
    citation: '',
    surveillanceStatus: '',
    relatedMaterials: [''],
    projectPublications: [''],
    othersCiting: [''],
  })

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormMessage('')

    if (formData.name === '') {
      setFormMessage('Project name cannot be blank')
      return
    }

    doCreateProject(formData)
  }

  const updateProjectData = (
    value: string,
    key: keyof typeof formData,
    index = 0
  ) => {
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

  let buttonMessage
  let submitDisabled
  switch (true) {
    case project.status === ProjectStatus.Saving:
      buttonMessage = 'Saving...'
      submitDisabled = true
      break
    case project.status === ProjectStatus.Saved:
      buttonMessage = 'Saved'
      submitDisabled = true
      break
    default:
      buttonMessage = 'Create project'
      submitDisabled = false
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
          value={formData.name}
          onChange={e => updateProjectData(e.target.value, 'name')}
        />
      </Label>
      <Label>
        Description
        <Textarea
          value={formData.description}
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
          item => item.label === formData.projectType
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
          item => item.label === formData.surveillanceStatus
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
        {formData.relatedMaterials.map((string, index) => (
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
      {formData.relatedMaterials.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              relatedMaterials: [...prev.relatedMaterials, ''],
            }))
          }
        >
          + Add more related laterial
        </AddMoreButton>
      )}
      <Label>
        Your project publications
        {formData.projectPublications.map((string, index) => (
          <Input
            key={index}
            type="text"
            name="your project publications"
            placeholder="Publication citation"
            value={string}
            onChange={e =>
              updateProjectData(e.target.value, 'projectPublications', index)
            }
          />
        ))}
      </Label>
      {formData.projectPublications.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              projectPublications: [...prev.projectPublications, ''],
            }))
          }
        >
          + Add more related material
        </AddMoreButton>
      )}
      <Label>
        Other publications citing this project
        {formData.othersCiting.map((string, index) => (
          <Input
            key={index}
            type="text"
            name="other projects citing"
            placeholder="Publication citation"
            value={string}
            onChange={e =>
              updateProjectData(e.target.value, 'othersCiting', index)
            }
          />
        ))}
      </Label>
      {formData.othersCiting.slice(-1)[0] !== '' && (
        <AddMoreButton
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              othersCiting: [...prev.othersCiting, ''],
            }))
          }
        >
          + Add more related material
        </AddMoreButton>
      )}
      <p style={{ margin: 0, padding: 0 }}>{formMessage}</p>
      <MintButton
        disabled={submitDisabled}
        onClick={handleSubmit}
        style={{ marginLeft: 'auto' }}
      >
        {buttonMessage}
      </MintButton>
    </Section>
  )
}

export default CreateProjectForm
