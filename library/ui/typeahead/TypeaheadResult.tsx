import React from 'react'

import styled from 'styled-components'
import { RenderItemProps } from '.'

import removeSVG from './assets/remove.svg'

const TypeaheadResultContainer = styled.span<{ selected?: boolean }>`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  text-align: left;
  padding: 8px 12px;
  background-color: rgba(0, 50, 100, 0);
  transition: 150ms ease;

  ${({ selected }) => selected && ` font-weight: 800; `}

  &:hover {
    background-color: rgba(0, 50, 100, 0.08);
    ${({ selected }) => selected && `background-color: rgba(100, 0, 50, 0.08);`}
  }
`

const TypeaheadResult = ({ item: { label }, selected }: RenderItemProps) => (
  <TypeaheadResultContainer selected={selected}>
    {label}
    {selected && (
      <img src={removeSVG} style={{ flexShrink: 0 }} alt="Remove item" />
    )}
  </TypeaheadResultContainer>
)

export default TypeaheadResult
