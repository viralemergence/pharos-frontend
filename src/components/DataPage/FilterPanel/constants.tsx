import React from 'React'
import styled from 'styled-components'

// After user finishes typing, how long to wait before applying a filter, in
// milliseconds
export const FILTER_DELAY = 300

type Timeout = ReturnType<typeof setTimeout> | null
export type TimeoutsType = Record<string, Timeout>

export type Field = {
  label: string
  dataGridKey?: string
  type?: 'text' | 'date'
}
export type FilterValue = string | string[]
export type Filter = { fieldId: string; value: FilterValue }

export const fields: Record<string, Field> = {
  projectName: { label: 'Project name', dataGridKey: 'Project name' },
  researcherName: { label: 'Author', dataGridKey: 'Authors' },
  hostSpecies: { label: 'Host species', dataGridKey: 'Host species' },
  detectionTarget: {
    label: 'Detection target',
    dataGridKey: 'Detection target',
  },
  detectionOutcome: {
    label: 'Detection outcome',
    dataGridKey: 'Detection outcome',
  },
  pathogen: { label: 'Pathogen', dataGridKey: 'Pathogen' },
  collectionStartDate: {
    label: 'Collection start date',
    dataGridKey: 'Collection start date',
    type: 'date',
  },
  collectionEndDate: {
    label: 'Collection end date',
    dataGridKey: 'Collection end date',
    type: 'date',
  },
}

export type ApplyFilterFunction = (
  newFilterValue: string,
  filterId: string,
  delay?: number
) => void

export const VALUE_SEPARATOR = '[\0SEPARATOR\0]'

const XIconSvg = styled.svg<{ extraStyle?: string }>`
  ${({ extraStyle }) => extraStyle}
`

export const XIcon = ({ extraStyle = '' }: { extraStyle?: string }) => (
  <XIconSvg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    extraStyle={extraStyle}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </XIconSvg>
)
