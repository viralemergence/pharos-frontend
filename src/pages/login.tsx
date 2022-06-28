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
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.darkPurpleWhiter};
`
const SubmitButton = styled.button`
  border: none;
  background: none;
`

const LoginPage = (): JSX.Element => {
  const data = useSignInPageData()

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
          <SubmitButton>
            <CMS.Text name="Button text" data={data} />
          </SubmitButton>
        </Container>
      </Main>
    </Providers>
  )
}

export default LoginPage
