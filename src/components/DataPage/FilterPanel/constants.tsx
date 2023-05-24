import React from 'react'
import styled from 'styled-components'

// After user finishes typing, how long to wait before applying a filter, in
// milliseconds
export const FILTER_DELAY = 300

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
  filterIndex: number,
  newFilterValue: string
) => void

export const VALUE_SEPARATOR = '|||'

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

export const PlusIcon = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 20 18"
    style={style}
  >
    <line x1="12" y1="5" x2="12" y2="19" stroke="white" stroke-width="2" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="white" stroke-width="2" />
  </svg>
)
