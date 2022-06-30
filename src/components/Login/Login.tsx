import React, { useState } from 'react'
import styled from 'styled-components'
import CMS from '@talus-analytics/library.airtable-cms'

import useSignInPageData from 'cmsHooks/useSignInPageData'
import useUser from 'hooks/useUser'

import authenticate from 'components/Login/authenticate'
import { UserStatus } from 'components/Login/UserContextProvider'
import { navigate } from 'gatsby'

const Container = styled.div`
  max-width: 500px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`
const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.darkPurpleWhiter};
  border-radius: 3px;
  font-size: 20px;
  margin-top: 40px;
`
const SubmitButton = styled.button`
  border: none;
  background: none;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.mint};
  margin-top: 60px;
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
          placeholder={CMS.getText(data, 'Input placeholder')}
          onChange={e => setResearcherID(e.target.value)}
          value={researcherID}
        />
        {user.status !== UserStatus.loggedOut && <p>{user.statusMessage}</p>}
        <SubmitButton type="submit">
          <CMS.Text name="Button text" data={data} />
        </SubmitButton>
        <HelpText name="Help text" data={data} />
      </form>
    </Container>
  )
}

export default Login
