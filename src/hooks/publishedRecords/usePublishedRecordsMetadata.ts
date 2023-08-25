import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Filter } from 'pages/data'
import isNormalObject from 'utilities/isNormalObject'
import { filterDefaultProperties } from 'components/DataPage/FilterPanel/FilterPanelToolbar'

const METADATA_URL = `${process.env.GATSBY_API_URL}/metadata-for-published-records`

const isValidFilterInMetadataResponse = (data: unknown): data is Filter => {
  if (!isNormalObject(data)) return false
  const { label, dataGridKey = '', type = 'text', options = [] } = data
  return (
    typeof label === 'string' &&
    typeof dataGridKey === 'string' &&
    typeof type === 'string' &&
    ['text', 'date'].includes(type) &&
    Array.isArray(options) &&
    options.every?.(option => typeof option === 'string')
  )
}

/** Check if the metadata in the response has the right structure */
const isResponseValid = (data: unknown): data is MetadataResponse => {
  if (!isNormalObject(data)) return false
  const { possibleFilters, sortableFields = [] } = data
  if (!isNormalObject(possibleFilters)) return false
  if (!Array.isArray(sortableFields)) return false
  if (!sortableFields.every(field => typeof field === 'string')) return false
  if (
    !Object.values(possibleFilters).every?.(filter =>
      isValidFilterInMetadataResponse(filter)
    )
  )
    return false
  return true
}

enum FetchStates {
  initial,
  loading,
  done,
  error,
}

interface ErrorWithMessage {
  message: string
}

/** Result of an attempt to fetch published records metadata */
type Result = {
  status: FetchStates
  metadata: Metadata | null
  error?: Error
}

const initialMetadata = {
  possibleFilters: [],
  sortableFields: [],
}

const fetchMetadata = async ({
  setResult,
}: {
  setResult: Dispatch<SetStateAction<Result>>
}) => {
  const response = await fetch(METADATA_URL)
  if (!response) return
  const responseJson = await response.json()
  if (!response.ok) {
    const message = responseJson as ErrorWithMessage
    setResult({
      status: FetchStates.error,
      error: new Error(
        `Status: ${response.status}; ${JSON.stringify(message)}`
      ),
      metadata: null,
    })
    return
  }

  if (isResponseValid(responseJson)) {
    // Transform possibleFilters from an object into an array
    const possibleFilters: Filter[] = Object.entries(
      responseJson.possibleFilters
    ).map(([id, filter]) => ({
      id,
      ...filterDefaultProperties,
      ...filter,
    }))
    setResult({
      status: FetchStates.done,
      metadata: { ...responseJson, possibleFilters },
    })
  } else {
    setResult({
      status: FetchStates.error,
      error: new Error('Invalid Response Structure'),
      metadata: null,
    })
  }
}

interface MetadataResponse {
  possibleFilters: Record<string, FilterInMetadataResponse>
  sortableFields?: string[]
}

interface Metadata {
  possibleFilters: Filter[]
  sortableFields?: string[]
}

interface FilterInMetadataResponse {
  label: string
  type?: 'text' | 'date'
  dataGridKey: string
  options: string[]
}

const useMetadata = () => {
  const [result, setResult] = useState<Result>({
    status: FetchStates.loading,
    metadata: initialMetadata,
  })
  const metadata = result.metadata ?? initialMetadata
  useEffect(() => {
    setResult({
      status: FetchStates.loading,
      metadata: initialMetadata,
    })
    fetchMetadata({ setResult })
  }, [])

  return metadata
}

export default useMetadata
