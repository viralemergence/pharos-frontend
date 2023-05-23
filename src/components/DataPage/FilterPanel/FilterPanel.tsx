import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import type { Filter } from './constants'
import { fields } from './constants'
import FilterPanelToggleButton from './FilterPanelToggleButton'
import FilterInput, { FilterInputElement } from './FilterInput'
import type { RuleGroupType, ValueEditorProps } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.scss' // recommended
import './filterPanel.scss'
import './queryBuilder.scss'
import Typeahead, { Item } from '@talus-analytics/library.ui.typeahead'
import type { TypeaheadProps } from '@talus-analytics/library.ui.typeahead'
import QueryBuilder, { Field } from './QueryBuilder'

const operators = [
  { name: '=', label: 'is' },
  // { name: '!=', label: 'is not' },
  // { name: '<', label: '<' },
  // { name: '>', label: '>' },
  // { name: '<=', label: '<=' },
  // { name: '>=', label: '>=' },
  // { name: 'in', label: 'in' },
]

const initialQuery: RuleGroupType = {
  combinator: 'and',
  rules: [],
}

const optionsForFields: Record<string, string[]> = {
  host_species: [
    'Panthera leo',
    'Canis lupus',
    'Felis catus',
    'Homo sapiens',
    'Alligator mississippiensis',
    'Equus ferus caballus',
    'Mus musculus',
    'Rattus norvegicus',
    'Columba livia',
    'Gallus gallus',
    'Sturnus vulgaris',
    'Haliaeetus leucocephalus',
    'Cervus elaphus',
    'Ursus arctos',
    'Python regius',
    'Aptenodytes forsteri',
    'Chrysemys picta',
    'Vulpes vulpes',
    'Pongo abelii',
    'Oryctolagus cuniculus',
    'Echeneis naucrates',
    'Carcharodon carcharias',
    'Orcinus orca',
    'Tursiops truncatus',
    'Panthera tigris',
    'Danaus plexippus',
    'Apis mellifera',
    'Drosophila melanogaster',
    'Quercus alba',
    'Arabidopsis thaliana',
    'Musa paradisiaca',
    'Helianthus annuus',
    'Pisum sativum',
    'Zea mays',
    'Saccharomyces cerevisiae',
    'Canis familiaris',
    'Bos taurus',
    'Ovis aries',
    'Sus scrofa domesticus',
    'Gallus gallus domesticus',
    'Anas platyrhynchos',
    'Fringilla coelebs',
    'Passer domesticus',
    'Bubo bubo',
    'Tachybaptus ruficollis',
    'Balaenoptera musculus',
    'Iguana iguana',
    'Pelodiscus sinensis',
    'Chelonia mydas',
    'Dendroaspis polylepis',
    'Python molurus',
    'Ailuropoda melanoleuca',
    'Struthio camelus',
    'Spheniscus demersus',
  ],
}

const SearchButton = styled.button<{ type: string; disabled: boolean }>`
  ${({ theme }) => theme.smallParagraph};
  border: none;
  background: #444;
  color: #fff;
  padding: 5px 15px;
  line-height: 32px;
  margin-left: 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`

const Panel = styled.div<{ isFilterPanelOpen: boolean; height: string }>`
  overflow-y: auto;
  background-color: rgba(51, 51, 51, 0.9);
  color: #fff;
  padding: ${props => (props.isFilterPanelOpen ? '34px 40px' : '0')};
  height: ${props => props.height};
  position: relative;
  width: 430px;
  top: 73px;
  left: 10px;
  border-radius: 10px;
  margin-right: 20px;
  backdrop-filter: blur(2px);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4);
  z-index: 3;
`

const FilterPanel = ({
  isFilterPanelOpen,
  filters,
  setFilters,
  onFilterInput,
  height,
  optionsForFields,
}: {
  isFilterPanelOpen: boolean
  filters: Filter[]
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
  /** Event handler for when one of the filter input elements receives new input */
  onFilterInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldId: string
  ) => void
  height: string
  optionsForFields: Record<string, string[]>
}) => {
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close field selector if panel is clicked
  // useEffect(() => {
  //   panelRef.current?.addEventListener('click', e => {
  //     setIsFieldSelectorOpen(false)
  //   });
  // }, []);
  return (
    <Panel
      className="pharos-panel"
      height={height}
      isFilterPanelOpen={isFilterPanelOpen}
      ref={panelRef}
      onClick={_ => {
        setIsFieldSelectorOpen(false)
      }}
    >
      {isFilterPanelOpen && (
        <QueryBuilder
          fields={fields}
          optionsForFields={optionsForFields}
          filters={filters}
          setFilters={setFilters}
          onFilterInput={onFilterInput}
          isFieldSelectorOpen={isFieldSelectorOpen}
          setIsFieldSelectorOpen={setIsFieldSelectorOpen}
        />
      )}
    </Panel>
  )
}

export default FilterPanel
