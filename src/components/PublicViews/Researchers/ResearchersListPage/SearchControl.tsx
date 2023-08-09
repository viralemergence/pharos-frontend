import React from 'react'

import SearchBar from 'components/ui/SearchBar'

import { PublishedResearchersFilters } from 'hooks/researchers/usePublishedResearchers'

interface SearchControlProps {
  filters: PublishedResearchersFilters
  setFilters: React.Dispatch<React.SetStateAction<PublishedResearchersFilters>>
}

const SearchControl = ({ filters, setFilters }: SearchControlProps) => (
  <SearchBar
    type="search"
    placeholder="Search"
    style={{ maxWidth: 'calc(100vw - 40px)' }}
    value={filters.searchString ?? ''}
    onChange={e => {
      setFilters({ searchString: e.target.value })
    }}
  />
)

export default SearchControl
