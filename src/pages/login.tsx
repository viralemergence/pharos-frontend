import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from '../components/layout/Providers'

import Main from '../components/layout/Main'
import NavBar from 'components/layout/NavBar/NavBar'

import useSignInPageData from 'cmsHooks/useSignInPageData'

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

const LoginPage = (): JSX.Element => {
  const data = useSignInPageData()

  const handleSubmit = () => {
    const getUserInfo = async () => {
      const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
        method: 'POST',
        body: '{ "id": "1234" }',
      })

      if (!response.ok) throw new Error(response.statusText)

      const data = await response.json()

      console.log(data)
    }

    getUserInfo()
  }

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <Main>
        <Container>
          <h1>
            <CMS.Text name="H1" data={data} />
          </h1>
          <Input
            type="text"
            placeholder={CMS.getText(data, 'Input placeholder')}
          />
          <SubmitButton onClick={handleSubmit}>
            <CMS.Text name="Button text" data={data} />
          </SubmitButton>
          <HelpText name="Help text" data={data} />
        </Container>
      </Main>
    </Providers>
  )
}

export default LoginPage
