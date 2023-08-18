import React from 'react'

import styled from 'styled-components'
import { RenderItemProps } from '../../../../library/ui/typeahead'
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
  align-items: center;
  img {
    max-height: 16px;
  }

  ${({ selected }) => selected && ` font-weight: 800; `};
`

export const DarkTypeaheadResult = ({
  item: { label },
  selected,
}: RenderItemProps) => {
  // Workaround because this was causing a TypeError in tests
  const iconSrc = process.env.NODE_ENV === 'test' ? '' : removeSVG
  return (
    <TypeaheadResultContainer selected={selected}>
      {label}
      {selected && (
        <img src={iconSrc} style={{ flexShrink: 0 }} alt="Remove item" />
      )}
    </TypeaheadResultContainer>
  )
}

export default DarkTypeaheadResult
