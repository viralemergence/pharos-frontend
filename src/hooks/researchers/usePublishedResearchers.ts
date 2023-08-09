import { useEffect, useState } from 'react'

import fetchPublishedResearchers, {
  PublishedResearcher,
  PublishedResearchersData,
  PublishedResearchersServerFilters,
  PublishedResearchersStatus,
} from './fetchPublishedResearchers'

interface PublishedResearchersClientFilters {
  startsWithLetter?: string
  searchString?: string
}

export type PublishedResearchersFilters = PublishedResearchersServerFilters &
  PublishedResearchersClientFilters

interface UsePublishedResearchersProps {
  filters?: PublishedResearchersFilters
}

interface UsePublishedResearchersData {
  status: PublishedResearchersStatus
  filtered: PublishedResearcher[]
  all: PublishedResearcher[]
  error: Error | null
}

const usePublishedResearchers = ({
  filters,
}: UsePublishedResearchersProps): UsePublishedResearchersData => {
  const [publishedResearchers, setPublishedResearchers] =
    useState<PublishedResearchersData>({
      status: PublishedResearchersStatus.Loading,
      error: null,
      data: [],
    })

  useEffect(() => {
    let ignore = false

    fetchPublishedResearchers({
      setPublishedResearchers,
      filters: filters?.researcherIDs
        ? { researcherIDs: filters?.researcherIDs }
        : {},
      ignore,
    })

    return () => {
      ignore = true
    }
  }, [filters?.researcherIDs])

  let publishedResearchersFiltered = publishedResearchers.data

  if (publishedResearchers.status === PublishedResearchersStatus.Loaded) {
    if (filters?.startsWithLetter) {
      const letter = filters.startsWithLetter
      publishedResearchersFiltered = publishedResearchersFiltered.filter(
        researcher => researcher.name.toLowerCase().startsWith(letter)
      )
    }
  }

  return {
    status: publishedResearchers.status,
    filtered: publishedResearchersFiltered,
    all: publishedResearchers.data,
    error: publishedResearchers.error,
  }
}

export default usePublishedResearchers
