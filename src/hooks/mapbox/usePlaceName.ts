import { LngLat } from 'mapbox-gl'
import useReverseGeocoder, { PlaceType } from './useReverseGeocoder'

const placeTypeFallbackOrder = [
  PlaceType.DISTRICT,
  PlaceType.LOCALITY,
  PlaceType.PLACE,
  PlaceType.REGION,
  PlaceType.COUNTRY,
]

interface PlaceNameLoading {
  loading: true
  error: false
  placeName: undefined
}

interface PlaceNameError {
  loading: false
  error: Error
  placeName: undefined
}

interface PlaceNameSuccess {
  loading: false
  error: false
  placeName: string
}

type UsePlaceNameData = PlaceNameLoading | PlaceNameError | PlaceNameSuccess

type UsePlaceName = (props: { lngLat: LngLat | null }) => UsePlaceNameData

const usePlaceName: UsePlaceName = ({ lngLat }) => {
  const { loading, error, result } = useReverseGeocoder({ lngLat })

  if (loading) return { loading, error, placeName: undefined }
  if (error) return { loading, error, placeName: undefined }

  for (const placeType of placeTypeFallbackOrder) {
    const place = result?.features.find(
      feature => feature.place_type[0] === placeType
    )

    if (place) return { loading, error, placeName: place.place_name }
  }

  return {
    loading,
    error: new Error('Place name not found'),
    placeName: undefined,
  }
}

export default usePlaceName
