import React from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import type { FilterInputEventHandler } from './FilterDrawer'

const getFontFromTheme = ({ theme }) =>
  theme?.bigParagraph?.match?.(/font-family:([^;]*)/)?.[1] || 'inherit'

const FilterInputElement = styled.input`
  background-color: ${({ theme }) => theme.black80Transparent};
  background-image: ${props => props.svgDataUrl};
  background-position: right 10px center;
  background-repeat: no-repeat;
  border-color: ${({ theme }) => theme.white};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.white};
  font-family: ${getFontFromTheme};
  font-size: 14px;
  margin-top: 0;
  padding: 10px 36px 10px 10px;
  position: relative;
  width: 350px;
`

export const FilterInputLabel = ({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) => (
  <InputLabel htmlFor={`filter-by-${name}`} style={{ marginBottom: '5px' }}>
    {children}
  </InputLabel>
)

export const FilterInput = ({
  name,
  handleFilterInput,
}: {
  name: string
  handleFilterInput: FilterInputEventHandler
}) => {
  const svg = `
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
            fill="white"
          />
        </svg>
    `

  // Convert the SVG to a data URL
  const svgDataUrl = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

  return (
    <FilterInputElement
      id={`filter-by-${name}`}
      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleFilterInput(e, name)
      }}
      svgDataUrl={svgDataUrl}
    />
  )
}
