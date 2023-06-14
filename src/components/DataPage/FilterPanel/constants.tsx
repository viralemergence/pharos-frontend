import React from 'react'
import styled from 'styled-components'

/** After user finishes typing, how long to wait before applying a filter, in
milliseconds */
export const loadDebounceDelay = 300
/** After the first load, debouncing is switched on for this many milliseconds */
export const debounceTimeout = 3000

export type Field = {
  label: string
  dataGridKey?: string
  type?: 'text' | 'date'
  options?: string[]
  addedToPanel?: boolean
}
export type FilterValues = string[]
export type Filter = { fieldId: string; values: FilterValues }

export type UpdateFilterFunction = (
  filterIndex: number,
  newFilterValues: FilterValues
) => void

const XIconSvg = styled.svg<{ extraStyle?: string }>`
  ${({ extraStyle }) => extraStyle}
`

export const XIcon = ({ extraStyle = '' }: { extraStyle?: string }) => (
  <XIconSvg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
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

const BackIconSvg = styled.svg`
  display: block;
  fill: none;
  height: 24px;
  width: 24px;
  stroke: #fff;
  stroke-width: 1.6;
  overflow: visible;
`

export const BackIcon = () => (
  <BackIconSvg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="presentation"
    focusable="false"
  >
    <path fill="none" d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"></path>
  </BackIconSvg>
)

export const PlusIcon = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 20 18"
    style={style}
  >
    <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2" />
  </svg>
)

export const FieldName = styled.div`
  margin-bottom: 5px;
`
