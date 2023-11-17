import React from 'react'
import styled, { ThemeType, useTheme } from 'styled-components'
import { Auth } from 'aws-amplify'

import MintButton, { MintButtonLink } from 'components/ui/MintButton'
import { Filter } from 'pages/data'

import useModal from 'hooks/useModal/useModal'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'
import LoadingSpinner from '../TableView/LoadingSpinner'

const ModalContainer = styled.div`
  width: 800px;
  max-width: 80vw;
  padding: 15px;
  display: flex;
  flex-direction: column;

  > h1 {
    ${({ theme }) => theme.h3};
    margin-bottom: 0;
  }

  > p {
    ${({ theme }) => theme.smallParagraph};
    margin: 30px 0;
  }
`

const ModalButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 30px;

  > h1 {
    ${({ theme }) => theme.h3};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

interface DataDownloadButtonProps {
  matchingRecordCount?: number
  filters: Filter[]
}

const requestExport = async (
  params: URLSearchParams,
  setModal: ReturnType<typeof useModal>,
  theme: ThemeType
) => {
  let userSession
  try {
    userSession = await Auth.currentSession()
  } catch (error) {
    setModal(
      <ModalContainer>
        <h1>Download Data</h1>
        <ColorMessage status={ColorMessageStatus.Warning}>
          Make an account to download data
        </ColorMessage>
        <p>
          You need to be signed in to your account to download data from PHAROS.
          Downloads will be saved to your account so that you can access the
          download and the citation later.
        </p>
        <ModalButtonContainer>
          <MintButtonLink to="/app/#/login">Sign in</MintButtonLink>
          <MintButtonLink secondary to="/app/#/sign-up">
            Sign up
          </MintButtonLink>
        </ModalButtonContainer>
      </ModalContainer>,
      { closeable: true }
    )
    return
  }

  setModal(
    <LoadingContainer>
      <h1>
        <LoadingSpinner color={theme.darkPurple} style={{ top: -3 }} />
        &nbsp; Loading...
      </h1>
    </LoadingContainer>,
    { closeable: true }
  )

  try {
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/download/?${params.toString()}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: userSession.getIdToken().getJwtToken(),
          'Content-Type': 'application/json',
        }),
      }
    )

    if (response && response.ok) {
      setModal(
        <ModalContainer>
          <h1>Download Data</h1>
          <ColorMessage status={ColorMessageStatus.Good}>
            Download sent via email
          </ColorMessage>
          <p>
            Your download and the corresponding citation are being emailed to
            you. This may take a few minutes. Downloads will be saved to your
            account so that you can access the download and the citation later.
          </p>
          <ModalButtonContainer>
            <MintButton onClick={() => setModal(null)}>Close</MintButton>
          </ModalButtonContainer>
        </ModalContainer>,
        { closeable: true }
      )
    } else {
      setModal(
        <ModalContainer>
          <h1>Download data</h1>
          <ColorMessage status={ColorMessageStatus.Danger}>
            There was an error requesting your export
          </ColorMessage>
          <p>{response.statusText}</p>
          <ModalButtonContainer>
            <MintButton onClick={() => setModal(null)}>Close</MintButton>
          </ModalButtonContainer>
        </ModalContainer>,
        { closeable: true }
      )
    }
  } catch (error) {
    setModal(
      <ModalContainer>
        <h1>Download data</h1>
        <ColorMessage status={ColorMessageStatus.Danger}>
          There was an error requesting your export
        </ColorMessage>
        <p>{(error as { message?: string })?.message}</p>
        <ModalButtonContainer>
          <MintButton onClick={() => setModal(null)}>Close</MintButton>
        </ModalButtonContainer>
      </ModalContainer>,
      { closeable: true }
    )
  }
}

const DataDownloadButton = ({
  matchingRecordCount,
  filters,
}: DataDownloadButtonProps) => {
  const setModal = useModal()
  const theme = useTheme()

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

    requestExport(params, setModal, theme)
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
