import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import type { FilterData } from './constants'
import FilterPanelToggleButton from './FilterPanelToggleButton'
import FilterInput, { FilterInputElement } from './FilterInput'
import type { RuleGroupType, ValueEditorProps } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.scss' // recommended
import './filterPanel.scss'
import './queryBuilder.scss'
import Typeahead, { Item } from '@talus-analytics/library.ui.typeahead'
import type { TypeaheadProps } from '@talus-analytics/library.ui.typeahead'
import QueryBuilder, { Field } from './QueryBuilder'

const fields: Field[] = [
  { id: 'host_species', label: 'Host species' },
  { id: 'pathogen', label: 'Pathogen' },
  { id: 'latitude', label: 'Latitude' },
  { id: 'longitude', label: 'Longitude' },
  { id: 'collection_date', label: 'Collection date' },
  { id: 'detection_target', label: 'Detection target' },
  { id: 'region', label: 'Region' },
]

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

const PanelHeader = styled.div`
  ${({ theme }) => theme.bigParagraph};
  margin-bottom: 20px;
`

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

const PanelContainer = styled.div<{
  isFilterPanelOpen: boolean
  height: string
}>`
  overflow-y: auto;
  background-color: ${({ theme }) => theme.black80Transparent};
  color: #fff;
  padding: ${props => (props.isFilterPanelOpen ? '34px 40px' : '0')};
  height: ${props => props.height};
  position: relative;
  width: 400px;
  top: 0px;
  left: 0px;
  margin-right: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4);
  z-index: 3;
`

const FilterPanel = ({
  isFilterPanelOpen,
  filterData,
  onFilterInput,
  height,
}: {
  isFilterPanelOpen: boolean
  filterData: FilterData
  /** Event handler for when one of the filter input elements receives new input */
  onFilterInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    filterId: string
  ) => void
  height: string
}) => {
  return (
    <PanelContainer
      className="pharos-panel"
      height={height}
      isFilterPanelOpen={isFilterPanelOpen}
    >
      {isFilterPanelOpen && (
        <>
          <PanelHeader>Filters</PanelHeader>
          <QueryBuilder
            fields={fields}
            filterData={filterData}
            onFilterInput={onFilterInput}
          />
          {/* {Array.from(filterData).map(([filterId, { description, value }]) => ( */}
          {/*   <div key={filterId} style={{ marginTop: '20px' }}> */}
          {/*     <InputLabel> */}
          {/*       <div style={{ marginBottom: '5px' }}> */}
          {/*         Search by {description} */}
          {/*       </div> */}
          {/*       <FilterInput */}
          {/*         defaultValue={value} */}
          {/*         onInput={e => onFilterInput(e, filterId)} */}
          {/*       /> */}
          {/*     </InputLabel> */}
          {/*   </div> */}
          {/* ))} */}
        </>
      )}
    </PanelContainer>
  )
}

export default FilterPanel
