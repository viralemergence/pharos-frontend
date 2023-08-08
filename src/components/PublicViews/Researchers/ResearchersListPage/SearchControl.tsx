import React from 'react'
import SearchBar from 'components/ui/SearchBar'

const SearchControl = () => {
  return (
    <SearchBar
      type="search"
      placeholder="Search"
      style={{ maxWidth: 'calc(100vw - 40px)' }}
    />
  )
}

export default SearchControl
