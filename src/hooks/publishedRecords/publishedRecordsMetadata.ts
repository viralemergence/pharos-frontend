import fetchPublishedRecordsMetadata, {
  PublishedRecordsMetadata,
  PublishedRecordsLoadingState,
  UsePublishedRecordsMetadataProps,
} from './fetchPublishedRecordsMetadata'

import { useEffect, useState } from 'react'

const usePublishedRecordsMetadata =
  ({}: UsePublishedRecordsMetadataProps): PublishedRecordsMetadata => {
    const [publishedRecordsMetadata, setPublishedRecordsMetadata] =
      useState<PublishedRecordsMetadata>({
        status: PublishedRecordsLoadingState.INITIAL,
        data: {},
      })

    useEffect(() => {
      let ignore = false

      setPublishedRecordsMetadata(prev => ({
        status: PublishedRecordsLoadingState.LOADING,
        data:
          prev.status !== PublishedRecordsLoadingState.ERROR ? prev.data : {},
      }))

      fetchPublishedRecordsMetadata({
        ignore,
        setPublishedRecordsMetadata,
        append: false,
      })

      return () => {
        ignore = true
      }
    }, [])

    const loadMetadata = () => {
      if (
        publishedRecordsMetadata.status !==
          PublishedRecordsLoadingState.ERROR &&
        publishedRecordsMetadata.status !==
          PublishedRecordsLoadingState.LOADING &&
        publishedRecordsMetadata.status !==
          PublishedRecordsLoadingState.LOADING_MORE &&
        publishedRecordsMetadata.data.isLastPage === false
      ) {
        setPublishedRecordsMetadata(prev => ({
          status: PublishedRecordsLoadingState.LOADING_MORE,
          data:
            prev.status !== PublishedRecordsLoadingState.ERROR ? prev.data : {},
        }))

        fetchPublishedRecords({
          ignore: false,
          setPublishedRecordsMetadata,
          append: true,
        })
      }
    }

    return [publishedRecordsMetadata, loadMetadata]
  }

export default usePublishedRecordsMetadata
