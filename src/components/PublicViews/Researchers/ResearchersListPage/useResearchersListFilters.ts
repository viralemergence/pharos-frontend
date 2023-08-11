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

const convertFiltersToParams = (filters: PublishedResearchersFilters) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })
  return params
}

const setFiltersInParams = (filters: PublishedResearchersFilters) => {
  if (typeof window === 'undefined') return

  const params = convertFiltersToParams(filters)

  let nextURL = `${window.location.pathname}`

  // add search params to url only if there are filters
  if (params.toString() !== '') nextURL += `?${params.toString()}`

  // don't replace or push state if the url is the same
  if (nextURL === `${window.location.pathname}${window.location.search}`) return

  // replace state if the user is typing a search
  if (filters.searchString) window.history.replaceState({}, '', nextURL)
  // for all other filters use pushState so they can "go back"
  else window.history.pushState({}, '', nextURL)
}

const handlePopState = (
  setFilters: React.Dispatch<React.SetStateAction<PublishedResearchersFilters>>
) => {
  if (typeof window === 'undefined') return

  setFilters(prev => {
    const params = new URLSearchParams(window.location.search)
    const filterParams = convertFiltersToParams(prev)

    if (params.toString() === filterParams.toString()) return prev

    console.log('popstate set filters')
    return getFiltersFromParams()
  })
}

// handle filters in state and synchronize with url search params
const usePublishedResearchersFilters = () => {
  const [filters, setFilters] = useState<PublishedResearchersFilters>(
    getFiltersFromParams()
  )

  // update our filters on popstate
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
