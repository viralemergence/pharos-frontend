import React, { useRef } from 'react'

import SearchBar from 'components/ui/SearchBar'

import { PublishedResearchersFilters } from 'hooks/researchers/usePublishedResearchers'
import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'

interface SearchControlProps {
  filters: PublishedResearchersFilters
  setFilters: React.Dispatch<React.SetStateAction<PublishedResearchersFilters>>
  filteredResearchers: PublishedResearcher[]
}

const SearchControl = ({
  filters,
  setFilters,
  filteredResearchers,
}: SearchControlProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredResearchers.length > 0) {
      setFilters({ researcherID: filteredResearchers[0].researcherID })
      inputRef.current?.blur()
    }
  }

  return (
    <SearchBar
      type="search"
      ref={inputRef}
      placeholder="Search"
      style={{ maxWidth: 'calc(100vw - 40px)' }}
      value={filters.searchString ?? ''}
      onChange={e => {
        setFilters({ searchString: e.target.value })
      }}
      onKeyPress={handleKeyPress}
    />
  )
}

export default SearchControl
