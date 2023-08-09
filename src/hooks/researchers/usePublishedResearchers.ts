import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'

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
  filters: PublishedResearchersFilters
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
      filters: filters?.researcherID
        ? { researcherID: filters?.researcherID }
        : {},
      ignore,
    })

    return () => {
      ignore = true
    }
  }, [filters?.researcherID])

  let publishedResearchersFiltered = publishedResearchers.data

  const fuse = new Fuse(publishedResearchersFiltered, {
    keys: ['name', 'email', 'organization'],
  })

  if (publishedResearchers.status === PublishedResearchersStatus.Loaded) {
    if (filters?.startsWithLetter) {
      const letter = filters.startsWithLetter
      publishedResearchersFiltered = publishedResearchersFiltered.filter(
        researcher => researcher.name.toLowerCase().startsWith(letter)
      )
    }

    if (filters.searchString && filters.searchString !== '') {
      publishedResearchersFiltered = fuse
        .search(filters.searchString)
        .map(result => result.item)
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
