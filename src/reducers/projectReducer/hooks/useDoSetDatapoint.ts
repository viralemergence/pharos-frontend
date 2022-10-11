import useDatasetID from 'hooks/dataset/useDatasetID'
import useDispatch from 'hooks/useDispatch'
import useUser from 'hooks/useUser'
import getTimestamp from 'utilities/getTimestamp'
import { StateActions } from '../projectReducer'
import { Datapoint } from '../types'

interface DoSetDatapointProps {
  recordID: string
  datapointID: string
  displayValue: string
  dataValue: Datapoint['dataValue']
}

const useDoSetDatapoint = () => {
  const projectDispatch = useDispatch()
  const datasetID = useDatasetID()
  const user = useUser()

  if (!user.data?.researcherID)
    throw new Error('Cannot set datapoint when user data is undefined ')

  const modifiedBy = user.data.researcherID

  const doSetDatapoint = ({
    recordID,
    datapointID,
    displayValue,
    dataValue,
  }: DoSetDatapointProps) => {
    const lastUpdated = getTimestamp()

    projectDispatch({
      type: StateActions.SetDatapoint,
      payload: {
        datasetID,
        recordID,
        datapointID,
        lastUpdated,
        datapoint: {
          displayValue,
          dataValue,
          modifiedBy,
        },
      },
    })
  }

  return doSetDatapoint
}

export default useDoSetDatapoint
