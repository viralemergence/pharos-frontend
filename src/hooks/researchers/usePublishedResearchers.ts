import { useEffect, useState } from 'react'

import fetchPublishedResearchers, {
  PublishedResearchersData,
  PublishedResearchersServerFilters,
  PublishedResearchersStatus,
} from './fetchPublishedResearchers'

interface UsePublishedResearchersProps {
  filters?: PublishedResearchersServerFilters
}

const usePublishedResearchers = ({
  filters,
}: UsePublishedResearchersProps): PublishedResearchersData => {
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

  return publishedResearchers
}

export default usePublishedResearchers
