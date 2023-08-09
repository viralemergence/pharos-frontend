import { useEffect, useState } from 'react'

import fetchPublishedResearchers, {
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

const usePublishedResearchers = ({ filters }: UsePublishedResearchersProps) => {
  const [publishedResearchers, setPublishedResearchers] =
    useState<PublishedResearchersData>({
      status: PublishedResearchersStatus.Loading,
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

  let publishedResearchersFiltered =
    publishedResearchers.status === PublishedResearchersStatus.Loaded
      ? publishedResearchers.data
      : []

  if (publishedResearchers.status === PublishedResearchersStatus.Loaded) {
    if (filters?.startsWithLetter) {
      const letter = filters.startsWithLetter
      publishedResearchersFiltered = publishedResearchersFiltered.filter(
        researcher => researcher.name.toLowerCase().startsWith(letter)
      )
    }
  }

  return {
    ...publishedResearchers,
    filtered: publishedResearchersFiltered,
  }
}

export default usePublishedResearchers
