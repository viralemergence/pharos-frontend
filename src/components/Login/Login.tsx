import React, { useState } from 'react'
import styled from 'styled-components'
import { navigate } from 'gatsby'

import CMS from '@talus-analytics/library.airtable-cms'

import Input from 'components/ui/Input'

import { UserStatus } from 'components/Login/UserContextProvider'
import useSignInPageData from 'cmsHooks/useSignInPageData'
import useUser from 'hooks/useUser'

import authenticate from 'components/Login/authenticate'
import MintButton from 'components/ui/MintButton'

const Container = styled.div`
  max-width: 500px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
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
const Login = () => {
  const data = useSignInPageData()
  const [researcherID, setResearcherID] = useState('')
  const [user, setUser] = useUser()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = await authenticate(researcherID)
    setUser(user)
    if (user.status === UserStatus.loggedIn) navigate('/')
  }

  return (
    <Container>
      <h1>
        <CMS.Text name="H1" data={data} />
      </h1>
      <form onSubmit={e => handleSubmit(e)}>
        <Input
          type="text"
          style={{ marginTop: 40 }}
          placeholder={CMS.getText(data, 'Input placeholder')}
          onChange={e => setResearcherID(e.target.value)}
          value={researcherID}
        />
        {user.status !== UserStatus.loggedOut && <p>{user.statusMessage}</p>}
        <MintButton type="submit" style={{ marginTop: 60 }}>
          <CMS.Text name="Button text" data={data} />
        </MintButton>
        <HelpText name="Help text" data={data} />
      </form>
    </Container>
  )
}

export default Login
