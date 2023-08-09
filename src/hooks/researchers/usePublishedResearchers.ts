import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'

import fetchPublishedResearchers, {
  PublishedResearcher,
  PublishedResearchersData,
  PublishedResearchersStatus,
} from './fetchPublishedResearchers'

interface PublishedResearchersClientFilters {
  startsWithLetter?: string
  searchString?: string
  researcherID?: string
}

export type PublishedResearchersFilters = PublishedResearchersClientFilters

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
      filters: {},
      ignore,
    })

    return () => {
      ignore = true
    }
  }, [])

  let publishedResearchersFiltered = publishedResearchers.data

  const fuse = new Fuse(publishedResearchersFiltered, {
    keys: ['name', 'organization'],
  })

  if (publishedResearchers.status === PublishedResearchersStatus.Loaded) {
    if (filters.startsWithLetter) {
      const letter = filters.startsWithLetter
      publishedResearchersFiltered = publishedResearchersFiltered.filter(
        researcher => researcher.name.toLowerCase().startsWith(letter)
      )
    }

    if (filters.searchString) {
      publishedResearchersFiltered = fuse
        .search(filters.searchString)
        .map(result => result.item)
    }

    if (filters.researcherID) {
      publishedResearchersFiltered = publishedResearchersFiltered.filter(
        researcher => researcher.researcherID === filters.researcherID
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
