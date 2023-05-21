import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { magnifyingGlassIconSvgUri, xIconSvgUri } from './Icons'

export const FilterInputElement = styled.input<{
  hasValue: boolean
  defaultValue: string
}>`
  ${({ theme }) => theme.bigParagraph};
  background-color: transparent; //${({ theme }) => theme.black80Transparent};
  background-image: ${props =>
    props.hasValue ? 'unset' : magnifyingGlassIconSvgUri};
  background-position: right 10px center;
  background-repeat: no-repeat;
  border: 1px solid rgba(0, 0, 0, 1);
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  line-height: unset;
  font-size: 14px;
  margin-top: 0;
  padding: 10px 40px 10px 10px;
  position: relative;
  width: 350px;

  // Workaround to remove browser-added background-color on autocompleted
  // inputs, see https://stackoverflow.com/a/69364368/3891407
  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    transition: background-color 600000s 0s, color 600000s 0s;
  }
`
const FilterInputContainer = styled.div`
  position: relative;
`

const FilterInputClearButton = styled.button`
  background-color: transparent;
  background-image: ${xIconSvgUri};
  background-position: center center;
  background-repeat: no-repeat;
  border: 0;
  content: '';
  font-size: 14pt;
  height: 100%;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 38px;
  z-index: 10;
  cursor: pointer;
  &:focus {
    opacity: .85;
  }
`

interface FilterInputProps {
  defaultValue: string
  onInput: (e: React.ChangeEvent<fieldId>) => void
}

const FilterInput = (props: FilterInputProps) => {
  const [hasValue, setHasValue] = useState(!!props.defaultValue)
  const inputRef = useRef<fieldId>(null)
  const onChange = (e: React.ChangeEvent<fieldId>) => {
    setHasValue(!!e.target.value)
  }
  return (
    <FilterInputContainer>
      <FilterInputElement
        {...props}
        onChange={onChange}
        hasValue={hasValue}
        ref={inputRef}
      />
      {hasValue && (
        <FilterInputClearButton
          onClick={() => {
            if (!inputRef.current) {
              console.error('No inputRef')
              return
            }
            setHasValue(false)
            inputRef.current.value = ''
            // Trigger the onInput event, which will remove the filter from the
            // table
            inputRef.current.dispatchEvent(
              new Event('input', {
                bubbles: true,
                cancelable: true,
              })
            )
          }}
        />
      )}
    </FilterInputContainer>
  )
}

export default FilterInput
