import React from 'react'

import styled from 'styled-components'
import { RenderItemProps } from '@talus-analytics/library.ui.typeahead'

import removeSVG from '../../../assets/darkTypeaheadRemove.svg'

const TypeaheadResultContainer = styled.span<{ selected?: boolean }>`
  ${({ theme }) => theme.smallParagraph};
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  text-align: left;
  padding: 8px 12px;

  ${({ selected }) => selected && ` font-weight: 800; `};
`

const DarkTypeaheadResult = ({
  item: { label },
  selected,
}: RenderItemProps) => (
  <TypeaheadResultContainer selected={selected}>
    {label}
    {selected && (
      <img src={removeSVG} style={{ flexShrink: 0 }} alt="Remove item" />
    )}
  </TypeaheadResultContainer>
)

export default DarkTypeaheadResult
