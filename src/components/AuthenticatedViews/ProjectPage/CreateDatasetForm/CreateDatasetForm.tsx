import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import getTimestamp from 'utilities/getTimestamp'
import useModal from 'hooks/useModal/useModal'
import useProjectID from 'hooks/project/useProjectID'
import { useNavigate } from 'react-router-dom'
import generateID from 'utilities/generateID'
import { datasetInitialValue } from 'reducers/stateReducer/initialValues'
import Typeahead from '../../../../../library/ui/typeahead'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'
import { Dataset } from 'reducers/stateReducer/types'

import units from '../../../../../config/units'

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
  margin-bottom: 15px;
`

export enum CreateDatasetFormMode {
  New = 'New',
  Edit = 'Edit',
}

interface NewCreateDatasetFormProps {
  mode: CreateDatasetFormMode.New
  dataset?: undefined
}

interface EditCreateDatasetFormProps {
  mode: CreateDatasetFormMode.Edit
  dataset: Dataset
}

type CreateDatasetFormProps =
  | NewCreateDatasetFormProps
  | EditCreateDatasetFormProps

interface FormData {
  name: string
  animalAgeUnits: keyof typeof units.age
  animalMassUnits: keyof typeof units.mass
  animalLengthUnits: keyof typeof units.length
}

const ageUnitOptions = Object.entries(units.age).map(([k, v]) => ({
  key: k,
  ...v,
}))
const massUnitOptions = Object.entries(units.mass).map(([k, v]) => ({
  key: k,
  ...v,
}))
const lengthUnitOptions = Object.entries(units.length).map(([k, v]) => ({
  key: k,
  ...v,
}))

const CreateDatasetForm = ({ mode, dataset }: CreateDatasetFormProps) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const dispatch = useDispatch()
  const setModal = useModal()
  const projectID = useProjectID()
  const datasetID = generateID.datasetID()

  const [formMessage, setFormMessage] = useState('')

  const [formData, setFormData] = useState<FormData>(
    mode === CreateDatasetFormMode.New
      ? {
          name: '',
          animalAgeUnits: 'seconds',
          animalMassUnits: 'kilograms',
          animalLengthUnits: 'meters',
        }
      : {
          name: dataset.name,
          animalAgeUnits: dataset.animalAgeUnits ?? 'seconds',
          animalMassUnits: dataset.animalMassUnits ?? 'kilograms',
          animalLengthUnits: dataset.animalLengthUnits ?? 'meters',
        }
  )

  const updateFormData = (value: string, key: keyof typeof formData) => {
    if (key === 'name')
      if (value === '') setFormMessage('Dataset name cannot be blank')
      else setFormMessage('')

    setFormData({ ...formData, [key]: value })
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (formData.name === '') {
      setFormMessage('Dataset name cannot be blank')
      return null
    }

    setFormMessage('')

    console.log(formData)

    switch (mode) {
      case CreateDatasetFormMode.New:
        dispatch({
          type: StateActions.CreateDataset,
          payload: {
            timestamp: getTimestamp(),
            projectID,
            dataset: {
              ...datasetInitialValue,
              datasetID,
              projectID,
              ...formData,
            },
          },
        })
        navigate(`/projects/${projectID}/${datasetID}`)
        break

      case CreateDatasetFormMode.Edit:
        dispatch({
          type: StateActions.EditDataset,
          payload: {
            timestamp: getTimestamp(),
            dataset: {
              ...dataset,
              ...formData,
            },
          },
        })
        break
    }

    setModal(null)
  }

  return (
    <Section onSubmit={handleSubmit}>
      <H1>
        {mode === CreateDatasetFormMode.New ? 'Create dataset' : 'Edit dataset'}
      </H1>
      <Label htmlFor="name" style={{ marginTop: 10 }}>
        Dataset name
      </Label>
      <Input
        id="name"
        type="text"
        name="name"
        autoFocus
        value={formData.name}
        onChange={e => updateFormData(e.target.value, 'name')}
      />

      <Label htmlFor="Animal age units">Animal age units *</Label>
      <Typeahead
        inputId="Animal age units"
        items={ageUnitOptions}
        values={[
          {
            key: formData.animalAgeUnits,
            label: units.age[formData.animalAgeUnits].label,
          },
        ]}
        placeholder="Seconds"
        placeholderColor={theme.darkGray}
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        style={{ boxShadow: 'none' }}
        onAdd={item => updateFormData(item.key, 'animalAgeUnits')}
      />

      <Label htmlFor="Animal mass units">Animal mass units *</Label>
      <Typeahead
        inputId="Animal mass units"
        items={massUnitOptions}
        values={[
          {
            key: formData.animalMassUnits,
            label: units.mass[formData.animalMassUnits].label,
          },
        ]}
        placeholder="Kilograms"
        placeholderColor={theme.darkGray}
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        style={{ boxShadow: 'none' }}
        onAdd={item => updateFormData(item.key, 'animalMassUnits')}
      />

      <Label htmlFor="Animal length units">Animal length units *</Label>
      <Typeahead
        inputId="Animal length units"
        items={lengthUnitOptions}
        values={[
          {
            key: formData.animalLengthUnits,
            label: units.length[formData.animalLengthUnits].label,
          },
        ]}
        placeholder="Meters"
        placeholderColor={theme.darkGray}
        borderColor={theme.darkPurple}
        backgroundColor={theme.veryLightGray}
        style={{ boxShadow: 'none' }}
        onAdd={item => updateFormData(item.key, 'animalLengthUnits')}
      />

      {formMessage && (
        <ColorMessage status={ColorMessageStatus.Danger}>
          {formMessage}
        </ColorMessage>
      )}

      <MintButton
        onClick={handleSubmit}
        style={{ marginRight: 'auto', marginTop: 30 }}
      >
        {CreateDatasetFormMode.New === mode
          ? 'Create new dataset'
          : 'Save changes'}
      </MintButton>
    </Section>
  )
}

export default CreateDatasetForm
