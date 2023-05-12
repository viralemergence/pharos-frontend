import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { magnifyingGlassIconSvgUri, xIconSvgUri } from './Icons'

const FilterInputElement = styled.input<{
  hasValue: boolean
  defaultValue: string
}>`
  ${({ theme }) => theme.bigParagraph};
  background-color: ${({ theme }) => theme.black80Transparent};
  background-image: ${props =>
    props.hasValue ? 'unset' : magnifyingGlassIconSvgUri};
  background-position: right 10px center;
  background-repeat: no-repeat;
  border: 1px solid ${({ theme }) => theme.white};
  border-color: ${({ theme }) => theme.white};
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
    border: 3px solid rgba(255, 255, 255, 0.1);
  }
`

interface FilterInputProps {
  defaultValue: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterInput = (props: FilterInputProps) => {
  const [hasValue, setHasValue] = useState(!!props.defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <FilterInputContainer>
      <FilterInputElement
        {...props}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setHasValue(!!e.target.value)
        }}
        hasValue={hasValue}
        ref={inputRef}
      />
      {hasValue && (
        <FilterInputClearButton
          onClick={() => {
            if (inputRef.current) {
              setHasValue(false)
              inputRef.current.value = ''
              inputRef.current?.dispatchEvent(
                new Event('input', {
                  bubbles: true,
                  cancelable: true,
                })
              )
            } else {
              console.error('No inputRef')
            }
          }}
        />
      )}
    </FilterInputContainer>
  )
}

export default FilterInput
