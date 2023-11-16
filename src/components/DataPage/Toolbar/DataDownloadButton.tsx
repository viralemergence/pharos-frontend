import React from 'react'
import styled from 'styled-components'
import { Auth } from 'aws-amplify'

import MintButton from 'components/ui/MintButton'
import { Filter } from 'pages/data'

import useModal from 'hooks/useModal/useModal'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'

const ModalContainer = styled.div`
  padding: 15px;

  > h1 {
    ${({ theme }) => theme.h3};
  }

  > p {
    ${({ theme }) => theme.smallParagraph};
  }
`

interface DataDownloadButtonProps {
  matchingRecordCount?: number
  filters: Filter[]
}

const requestExport = async (
  params: URLSearchParams,
  setModal: ReturnType<typeof useModal>
) => {
  let userSession
  try {
    userSession = await Auth.currentSession()
  } catch (error) {
    setModal(
      <ModalContainer>
        <h1>You must be logged in to create an export</h1>
        <ColorMessage status={ColorMessageStatus.Warning}>
          Make an account to download data
        </ColorMessage>
        <p>
          You need to be signed in to your account to download data from PHAROS.
          Downloads will be saved to your account so that you can access the
          download and the citation later.
        </p>
      </ModalContainer>,
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

  const response = await fetch(
    `${process.env.GATSBY_API_URL}/download/?${params.toString()}`,
    {
      method: 'GET',
      headers: new Headers({
        Authorization: userSession.getIdToken().getJwtToken(),
        'Content-Type': 'application/json',
      }),
    }
  ).catch(error => {
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
  filters,
}: DataDownloadButtonProps) => {
  const setModal = useModal()

  const handleClick = () => {
    const params = filters.reduce((params, filter) => {
      filter.values.forEach(
        // the 'Boolean(value)' here is to emulate the behavior in
        // src/components/DataPage/TableView/utilities/load.ts
        // but I don't see why filters.values would hold falsy values.
        value => Boolean(value) && params.append(filter.id, value)
      )
      return params
    }, new URLSearchParams())

    requestExport(params, setModal)
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
