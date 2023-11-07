import { useEffect, useState } from 'react'

export interface DataDownloadMetadata {
  downloadID: string
  downloadDate: string
  projects: {
    projectID: string
    name: string
  }[]
  researchers: {
    researcherID: string
    name: string
  }[]
  accessLink: string
}

export enum DataDownloadMetadataStatus {
  Loading,
  Loaded,
  Error,
}

interface DataDownloadMetadataLoaded {
  status: DataDownloadMetadataStatus.Loaded
  data: DataDownloadMetadata
}

interface DataDownloadMetadataError {
  status: DataDownloadMetadataStatus.Error
  data: {
    downloadID: string
    error: Error
  }
}

interface ErrorWithMessage {
  message: string
}

interface DataDownloadMetadataLoading {
  status: DataDownloadMetadataStatus.Loading
  data: {
    downloadID: string
  }
}

type DataDownloadMetadataState =
  | DataDownloadMetadataLoading
  | DataDownloadMetadataLoaded
  | DataDownloadMetadataError

const dataIsDataDownloadMetadata = (
  data: unknown
): data is DataDownloadMetadata => {
  if (!data || typeof data !== 'object') return false
  const metadata = data as Partial<DataDownloadMetadata>

  if (typeof metadata.downloadID !== 'string') return false
  if (typeof metadata.downloadDate !== 'string') return false
  if (!Array.isArray(metadata.projects)) return false
  if (!Array.isArray(metadata.researchers)) return false
  if (typeof metadata.accessLink !== 'string') return false
  return true
}

const loadDownloadMetadata = async (
  downloadID: string,
  setDownloadMetadata: React.Dispatch<
    React.SetStateAction<DataDownloadMetadataState>
  >
) => {
  const params = new URLSearchParams()
  params.append('downloadID', downloadID)

  const response = await fetch(
    `${process.env.GATSBY_API_URL}/download-metadata/?${params.toString()}`
  ).catch(error => {
    setDownloadMetadata({
      status: DataDownloadMetadataStatus.Error,
      data: {
        downloadID,
        error,
      },
    })
    return
  })

  if (!response) {
    setDownloadMetadata({
      status: DataDownloadMetadataStatus.Error,
      data: { downloadID, error: new Error('No response') },
    })
    return
  }

  if (!response.ok) {
    const message = (await response.json()) as ErrorWithMessage
    setDownloadMetadata({
      status: DataDownloadMetadataStatus.Error,
      data: {
        downloadID,
        error: new Error(`Status: ${response.status}; ${message.message}`),
      },
    })
    return
  }

  const data = await response.json()

  if (!dataIsDataDownloadMetadata(data)) {
    setDownloadMetadata({
      status: DataDownloadMetadataStatus.Error,
      data: {
        downloadID,
        error: new Error('Invalid data'),
      },
    })
    return
  }

  setDownloadMetadata({
    status: DataDownloadMetadataStatus.Loaded,
    data,
  })
}

const useDownloadMetadata = () => {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams('')

  const downloadID = params.get('dwn')!

  const [downloadMetadata, setDownloadMetadata] =
    useState<DataDownloadMetadataState>({
      status: DataDownloadMetadataStatus.Loading,
      data: {
        downloadID: downloadID,
      },
    })

  useEffect(() => {
    setDownloadMetadata({
      status: DataDownloadMetadataStatus.Loading,
      data: { downloadID },
    })
    loadDownloadMetadata(downloadID, setDownloadMetadata)
  }, [downloadID])

  return downloadMetadata
}

export default useDownloadMetadata
