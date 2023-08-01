import { LngLat } from 'mapbox-gl'
import { useEffect, useState } from 'react'

// https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object

export enum PlaceType {
  COUNTRY = 'country',
  REGION = 'region',
  POSTCODE = 'postcode',
  DISTRICT = 'district',
  PLACE = 'place',
  LOCALITY = 'locality',
  NEIGHBORHOOD = 'neighborhood',
  ADDRESS = 'address',
  POI = 'poi',
}

interface Context {
  id: string
  mapbox_id: string
  text: string
  wikidata?: string
  short_code?: string
}

interface Properties {
  accuracy?: string
  address?: string
  category?: string
  maki?: string
  wikidata?: string
  short_code?: string
}

interface MapboxGeocoderPoint {
  type: 'Point'
  coordinates: [number, number]
  interpolated?: boolean
  omitted?: boolean
}

interface MapboxGeocoderFeature {
  id: string
  type: 'Feature'
  place_type: PlaceType[]
  relevance: number
  address: string
  properties: Properties
  text: string
  matching_text?: string
  place_name: string
  matching_place_name?: string
  language?: string
  bbox: [number, number, number, number]
  center: [number, number]
  geometry: MapboxGeocoderPoint
  context: Context[]
}

interface GeocoderResponse {
  type: 'FeatureCollection'
  query: string[]
  features: MapboxGeocoderFeature[]
  attribution: string
}

interface ReverseGeocoderDataLoading {
  loading: true
  error: false
  result: undefined
}

interface ReverseGeocoderDataError {
  loading: false
  error: Error
  result: undefined
}

interface ReverseGeocoderDataSuccess {
  loading: false
  error: false
  result: GeocoderResponse
}

type ReverseGeocoderData =
  | ReverseGeocoderDataLoading
  | ReverseGeocoderDataError
  | ReverseGeocoderDataSuccess

const endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places'

type UseReverseGeocoder = (props: {
  lngLat: LngLat | null
}) => ReverseGeocoderData

const useReverseGeocoder: UseReverseGeocoder = ({ lngLat }) => {
  const [reverseGeocoderData, setReverseGeocoderData] =
    useState<ReverseGeocoderData>({
      loading: true,
      error: false,
      result: undefined,
    })

  useEffect(() => {
    let ignore = false
    if (!lngLat) return

    const requestReverseGeocode = async () => {
      const key = process.env.GATSBY_MAPBOX_API_KEY
      if (!key) throw new Error('No Mapbox API key found')

      setReverseGeocoderData({
        loading: true,
        error: false,
        result: undefined,
      })

      const params = new URLSearchParams({
        access_token: key,
      })

      const response = await fetch(
        `${endpoint}/${lngLat.lng},${lngLat.lat}.json?${params.toString()}`
      )

      if (ignore) return

      if (!response) {
        setReverseGeocoderData({
          loading: false,
          error: new Error('No response from Mapbox API'),
          result: undefined,
        })
        return
      }

      if (!response.ok) {
        setReverseGeocoderData({
          loading: false,
          error: new Error(
            `Mapbox API error: ${response.status}, ${response.statusText}`
          ),
          result: undefined,
        })

        return
      }

      const data = await response.json()

      console.log(data)

      setReverseGeocoderData({
        loading: false,
        error: false,
        result: data as GeocoderResponse,
      })
    }

    requestReverseGeocode()

    return () => {
      ignore = true
    }
  }, [lngLat])

  if (!lngLat)
    return {
      loading: false,
      error: new Error('lngLat not provided'),
      result: undefined,
    }

  return reverseGeocoderData
}

export default useReverseGeocoder
