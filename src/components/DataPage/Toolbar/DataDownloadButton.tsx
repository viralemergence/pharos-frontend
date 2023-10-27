import { Auth } from 'aws-amplify'
import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import React from 'react'

interface DataDownloadButtonProps {
  matchingRecordCount?: number
}

const requestExport = async (setModal: ReturnType<typeof useModal>) => {
  let userSession
  try {
    userSession = await Auth.currentSession()
  } catch (error) {
    setModal(
      <div style={{ padding: 15 }}>
        <h1>You must be logged in to create an export</h1>
        <p>Log in or sign up to continue</p>
      </div>,
      { closeable: true }
    )
    return
  }

  setModal(
    <div style={{ padding: 15 }}>
      <h1>Loading...</h1>
    </div>,
    { closeable: true }
  )

  const response = await fetch(`${process.env.GATSBY_API_URL}/download/`, {
    method: 'GET',
    headers: new Headers({
      Authorization: userSession.getIdToken().getJwtToken(),
      'Content-Type': 'application/json',
    }),
  }).catch(error => {
    setModal(
      <div style={{ padding: 15 }}>
        <h1>There was an error requesting your export</h1>
        <p>{error.message}</p>
      </div>,
      { closeable: true }
    )
  })

  if (response && response.ok) {
    setModal(
      <div style={{ padding: 15 }}>
        <h1>Your export has been requested</h1>
        <p>You will receive an email when your export is ready for download</p>
      </div>,
      { closeable: true }
    )
  } else {
    setModal(
      <div style={{ padding: 15 }}>
        <h1>There was an error requesting your export</h1>
        <p>{response?.statusText}</p>
      </div>,
      { closeable: true }
    )
  }
}

const DataDownloadButton = ({
  matchingRecordCount,
}: DataDownloadButtonProps) => {
  const setModal = useModal()

  const handleClick = () => {
    requestExport(setModal)
  }

  return (
    <>
      <MintButton
        style={{ marginLeft: 'auto', position: 'relative' }}
        onClick={handleClick}
      >
        Download Data ({(matchingRecordCount ?? 0).toLocaleString()} rows)
      </MintButton>
    </>
  )
}

export default DataDownloadButton
