import React from 'react'

import CreateDatasetForm, {
  CreateDatasetFormMode,
} from '../CreateDatasetForm/CreateDatasetForm'

import styled from 'styled-components'

import useModal from 'hooks/useModal/useModal'
import { lighten } from 'polished'

const Text = styled.div`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.black};
  padding: 5px;
  transition: 200ms ease;
`
const ButtonRow = styled.button`
  background: none;
  border: none;
  background-color: ${({ theme }) => theme.hoverMint};
  transition: 200ms ease;

  &:hover {
    background-color: ${({ theme }) => lighten(0.05, theme.mint)};

    > div {
      transition: 200ms ease;
      color: ${({ theme }) => theme.black};
    }
  }
  border-top: 1px solid ${({ theme }) => theme.medGray};

  @media (max-width: ${650 - 1}px) {
    border: 1px solid ${({ theme }) => theme.mint};
    background-color: ${({ theme }) => theme.mint};
    padding: 15px;
  }
`

const CreateNewDatasetRow = (): JSX.Element => {
  const setModal = useModal()

  return (
    <ButtonRow
      key="0"
      onClick={e => {
        e.preventDefault()
        setModal(<CreateDatasetForm mode={CreateDatasetFormMode.New} />, {
          closeable: true,
        })
      }}
    >
      <Text>
        <span style={{ fontStyle: 'normal' }}>+</span> Create new dataset
      </Text>
    </ButtonRow>
  )
}

export default CreateNewDatasetRow
