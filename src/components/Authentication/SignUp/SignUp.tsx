import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

import Main from 'components/layout/Main'
import Input from 'components/ui/Input'
import Label from 'components/ui/InputLabel'
import MintButton from 'components/ui/MintButton'

import userpool from '../userpool'
import { Link } from 'react-router-dom'

const Container = styled(Main)`
  max-width: 505px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h1}
`
const Form = styled.form`
  margin-top: 40px;
`

const registerUser = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    userpool.signUp(
      email,
      password,
      [],
      // [new CognitoUserAttribute({ Name: "email", Value: email })],
      [],
      (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result?.user)
      }
    )
  })
}

const SignUp = () => {
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const [submitting, setSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await registerUser(email, password)
      console.log(response)
      setSubmitting(false)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <H1>Sign Up</H1>
      <p>
        Already have an account? <Link to={`/login`}>sign in here.</Link>
      </p>
      <Form onSubmit={handleSubmit}>
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
            ref={firstInputRef}
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </Label>
        <MintButton
          type="submit"
          style={{ marginTop: 40 }}
          disabled={submitting}
        >
          {submitting ? 'loading...' : 'Sign up'}
        </MintButton>
      </Form>
    </Container>
  )
}

export default SignUp
