import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'

import useSignInPageData from 'cmsHooks/useSignInPageData'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import Main from 'components/layout/Main'
import useAuthenticate from 'components/Authentication/Login/useAuthenticate'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'

const Container = styled(Main)`
  max-width: 505px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h1}
`
// const HelpText = styled(CMS.RichText)`
//   margin-top: 32px;
//   > p {
//     font-size: 18px;
//   }

//   a {
//     color: ${({ theme }) => theme.black};
//   }
// `
const Form = styled.form`
  margin-top: 40px;
`
const Login = () => {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const data = useSignInPageData()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [formMessage, setFormMessage] = useState('')
  const authenticate = useAuthenticate(setFormMessage)

  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormMessage('')
    setSubmitting(true)

    const result = await authenticate(email, password)

    setSubmitting(false)

    // if successful, navigate to 'next' from search params
    if (result) {
      navigate(search.get('next') || '/')
    }
  }

  return (
    <Container>
      <H1>Sign in</H1>
      <Form onSubmit={e => handleSubmit(e)}>
        <Label>
          Email
          <Input
            type="text"
            spellCheck="false"
            ref={firstInputRef}
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </Label>
        <Label>
          Password
          <Input
            type="password"
            spellCheck="false"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </Label>
        {formMessage && (
          <ColorMessage status={ColorMessageStatus.Danger}>
            {formMessage}
          </ColorMessage>
        )}

        <MintButton
          type="submit"
          style={{ marginTop: 40 }}
          disabled={submitting}
        >
          {submitting ? 'loading...' : <CMS.Text name="CTA" data={data} />}
        </MintButton>
      </Form>
    </Container>
  )
}

export default Login
