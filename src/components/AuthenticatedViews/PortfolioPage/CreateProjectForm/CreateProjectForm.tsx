import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import useUser from 'hooks/useUser'
import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import Textarea from 'components/ui/Textarea'
import Typeahead from '@talus-analytics/library.ui.typeahead'

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
  { key: '1', label: 'Routine Surveillance' },
  { key: '2', label: 'Type two' },
  { key: '3', label: 'Type three' },
]

const CreateProjectForm = () => {
  const user = useUser()
  const [formMessage, setFormMessage] = useState('')
  const theme = useTheme()

  const [projectData, setProjectData] = useState({
    projectName: '',
    description: '',
    projectType: '',
    surveillanceType: '',
    relatedMaterials: [''],
    publicationsCiting: [''],
  })

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(projectData)
    alert('create project')
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

  return (
    <Section>
      <H1>Create Project</H1>
      <Label>
        Project name
        <Input
          type="text"
          name="name"
          autoFocus
          value={projectData.projectName}
          onChange={e => updateProjectData(e.target.value, 'projectName')}
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
        style={{ marginBottom: 15 }}
        items={projectTypes}
        placeholder="Project type"
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        onAdd={item => updateProjectData(item.label, 'surveillanceType')}
        values={projectTypes.filter(
          item => item.label === projectData.surveillanceType
        )}
      />
      <Label>
        Cite this project
        <Textarea
          name="citation"
          onChange={e => updateProjectData(e.target.value, 'surveillanceType')}
        />
      </Label>
      <Label>
        Related materials
        {projectData.relatedMaterials.map((string, index) => (
          <Input
            key={index}
            type="text"
            name="name"
            autoFocus
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
          + Add more related material
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
            autoFocus
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
        Create
      </MintButton>
    </Section>
  )
}

export default CreateProjectForm
