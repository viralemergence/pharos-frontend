import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { navigate } from 'gatsby'

import CMS from '@talus-analytics/library.airtable-cms'

import useSignInPageData from 'cmsHooks/useSignInPageData'
import useUser from 'hooks/useUser'

import { UserStatus } from 'components/Login/UserContextProvider'
import authenticate from 'components/Login/authenticate'
import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

const Container = styled.div`
  max-width: 500px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h1}
`
const HelpText = styled(CMS.RichText)`
  margin-top: 32px;
  > p {
    font-size: 18px;
  }

  a {
    color: ${({ theme }) => theme.black};
  }
`
const Form = styled.form`
  margin-top: 40px;
`
const Login = () => {
  const data = useSignInPageData()
  const [researcherID, setResearcherID] = useState('')
  const [user, setUser] = useUser()

  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = await authenticate(researcherID)
    setUser(user)
    if (user.status === UserStatus.loggedIn) navigate('/')
  }

  return (
    <Container>
      <H1>
        <CMS.Text name="H1" data={data} />
      </H1>
      <Form onSubmit={e => handleSubmit(e)}>
        <Label>
          <CMS.Text data={data} name="Input placeholder" />
          <Input
            ref={firstInputRef}
            type="text"
            onChange={e => setResearcherID(e.target.value)}
            value={researcherID}
          />
        </Label>
        {user.status !== UserStatus.loggedOut && <p>{user.statusMessage}</p>}
        <MintButton type="submit" style={{ marginTop: 40 }}>
          <CMS.Text name="Button text" data={data} />
        </MintButton>
        <HelpText name="Help text" data={data} />
      </Form>
    </Container>
  )
}

export default Login
