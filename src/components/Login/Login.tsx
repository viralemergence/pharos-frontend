import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'

import useSignInPageData from 'cmsHooks/useSignInPageData'
import useUser from 'hooks/useUser'

import { UserStatus } from 'components/Login/UserContextProvider'
import authenticate from 'components/Login/authenticate'
import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import Main from 'components/layout/Main'

const Container = styled(Main)`
  max-width: 505px;
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
  const user = useUser()

  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const navigate = useNavigate()
  const [search] = useSearchParams()

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    // authenticate details
    const user = await authenticate(researcherID)

    // store in global user context
    setUser(user)

    setSubmitting(false)

    // if successful, navigate to 'next' from search params
    if (user.status === UserStatus.loggedIn) {
      navigate(search.get('next') || '/')
    }
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
            type="text"
            spellCheck="false"
            ref={firstInputRef}
            onChange={e => setResearcherID(e.target.value)}
            value={researcherID}
            style={{ textTransform: 'uppercase' }}
          />
        </Label>
        {user.status !== UserStatus.loggedOut && <p>{user.statusMessage}</p>}
        <MintButton
          type="submit"
          style={{ marginTop: 40 }}
          disabled={submitting}
        >
          {submitting ? 'loading...' : <CMS.Text name="CTA" data={data} />}
        </MintButton>
        <HelpText name="Help text" data={data} />
      </Form>
    </Container>
  )
}

export default Login
