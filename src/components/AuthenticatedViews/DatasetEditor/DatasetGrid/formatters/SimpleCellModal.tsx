import React from 'react'
import Modal from 'components/ui/Modal'
import { Datapoint } from 'reducers/projectReducer/types'
import styled from 'styled-components'

interface SimpleCellModalProps {
  datapoint: Datapoint
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Container = styled.div`
  display: flex;
  min-width: 400px;
  min-height: 300px;
`
const Data = styled.div`
  flex-basis: 50%;
`
const History = styled.div`
  flex-basis: 50%;
`

const getDatapointHistory = (
  datapoint: Datapoint,
  history: Datapoint[] = []
): Datapoint[] => {
  history = [...history, datapoint]
  if (!datapoint.previous) return history
  return getDatapointHistory(datapoint.previous, history)
}

const SimpleCellModal = ({
  datapoint,
  open,
  setOpen,
}: SimpleCellModalProps) => {
  if (!open) return <></>

  const history = getDatapointHistory(datapoint)

  return (
    <Modal closeable {...{ open, setOpen }}>
      <Container>
        <Data>
          <h5>Value</h5>
          <label>{datapoint.displayValue}</label>
        </Data>
        <History>
          <h5>History</h5>
          {history &&
            history.map(datapoint => (
              <div
                key={datapoint.version}
                style={{ border: '1px solid', padding: 5, margin: 5 }}
              >
                <div>Value: {datapoint.displayValue}</div>
                <div>Version: {datapoint.version}</div>
                <div>Last Updated by: {datapoint.modifiedBy}</div>
              </div>
            ))}
        </History>
      </Container>
    </Modal>
  )
}

export default SimpleCellModal
