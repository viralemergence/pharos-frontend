import { PublishedResearchersFilters } from 'hooks/researchers/usePublishedResearchers'
import { useEffect, useState } from 'react'

const getFiltersFromParams = () => {
  if (typeof window === 'undefined') return { searchString: '' }
  const params = new URLSearchParams(window.location.search)

  // make sure searchString is always set
  const searchString = params.get('searchString') ?? ''
  const paramsFilters: PublishedResearchersFilters = { searchString }

  const researcherID = params.get('researcherID')
  if (researcherID) paramsFilters.researcherID = researcherID

  // set startsWithLetter only if there is no search string
  const startsWithLetter = params.get('startsWithLetter')
  if (!searchString && !researcherID && startsWithLetter)
    paramsFilters.startsWithLetter = startsWithLetter

  return paramsFilters
}

const setFiltersInParams = (filters: PublishedResearchersFilters) => {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })

  let nextURL = `${window.location.pathname}`
  if (params.toString() !== '') nextURL += `?${params.toString()}`

  // replace state if the user is typing a search
  if (filters.searchString) window.history.replaceState({}, '', nextURL)
  // for other filters use pushState so they can "go back"
  else window.history.pushState({}, '', nextURL)
}

const handlePopState = (
  setFilters: React.Dispatch<React.SetStateAction<PublishedResearchersFilters>>
) => {
  setFilters(getFiltersFromParams())
}

// handle filters in state and synchronize with url search params
const usePublishedResearchersFilters = () => {
  const [filters, setFilters] = useState<PublishedResearchersFilters>(
    getFiltersFromParams()
  )

  useEffect(() => {
    window.addEventListener('popstate', () => handlePopState(setFilters))
    return () => window.removeEventListener('popstate', () => handlePopState)
  }, [])

  // update search params when filters change
  useEffect(() => {
    setFiltersInParams(filters)
  }, [filters])

  return [filters, setFilters] as const
}

export default usePublishedResearchersFilters
