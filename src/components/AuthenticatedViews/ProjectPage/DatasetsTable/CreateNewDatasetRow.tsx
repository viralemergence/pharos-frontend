import React from 'react'

import CreateDatasetForm from '../CreateDatasetForm/CreateDatasetForm'

import styled from 'styled-components'

import useModal from 'hooks/useModal/useModal'
import { lighten } from 'polished'

const Text = styled.div`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
  font-style: italic;
  padding: 15px;
  transition: 200ms ease;
`
const ButtonRow = styled.button`
  background: none;
  border: none;
  // text-align: left;
  background-color: ${({ theme }) => theme.lightMint};
  transition: 200ms ease;

  &:hover {
    background-color: ${({ theme }) => lighten(0.05, theme.hoverMint)};

    > div {
      transition: 200ms ease;
      color: ${({ theme }) => theme.black};
    }
  }

  // &:nth-child(2) {
  border-top: 1px solid ${({ theme }) => theme.lightGray};
  // }
`

const CreateNewDatasetRow = (): JSX.Element => {
  const setModal = useModal()

  return (
    <ButtonRow
      key="0"
      onClick={e => {
        e.preventDefault()
        setModal(<CreateDatasetForm />, { closeable: true })
      }}
    >
      <Text>
        <span style={{ fontStyle: 'normal' }}>+</span> Create new dataset
      </Text>
    </ButtonRow>
  )
}

export default CreateNewDatasetRow
