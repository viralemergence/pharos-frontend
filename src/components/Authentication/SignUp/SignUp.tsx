import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Auth } from 'aws-amplify'
// import { CognitoUser } from '@aws-amplify/auth'
import { ISignUpResult } from 'amazon-cognito-identity-js'

import Main from 'components/layout/Main'
import Input from 'components/ui/Input'
import Label from 'components/ui/InputLabel'
import MintButton from 'components/ui/MintButton'

import { Link, useNavigate } from 'react-router-dom'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'

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

const SignUp = () => {
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formMessage, setFormMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createUserResponse, setCreateUserResponse] = useState<ISignUpResult>()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setFormMessage('')

    if (!firstName) {
      setFormMessage('First name is required')
      return
    }

    if (!lastName) {
      setFormMessage('Last name is required')
      return
    }
    if (!email) {
      setFormMessage('Email is required')
      return
    }
    if (!password) {
      setFormMessage('Password is required')
      return
    }

    try {
      const signUpResponse = await Auth.signUp({
        username: email,
        password,
        autoSignIn: {
          enabled: false,
        },
      })
      setCreateUserResponse(signUpResponse)
      setFormMessage(`Please check your email for a confirmation code.`)
      setSubmitting(false)
    } catch (error) {
      console.error({ error })
      const { message } = error as { code: string; message: string }
      setFormMessage(message)
      setSubmitting(false)
    }
  }

  const handleSubmitConfimation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setFormMessage('')
    setSubmitting(true)

    if (!createUserResponse) {
      setFormMessage('No user found to confirm.')
      return
    }

    const username = createUserResponse.user.getUsername()

    try {
      await Auth.confirmSignUp(username, confirmationCode)
      await Auth.signIn(username, password)

      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken()

      try {
        // wait here to make sure the user object is created successfully
        const response = await fetch(
          `${process.env.GATSBY_API_URL}/${'create-user'}`,
          {
            method: 'POST',
            headers: new Headers({
              Authorization: idToken.getJwtToken(),
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              name: `${firstName} ${lastName}`,
              email,
              organization,
              firstName,
              lastName,
            }),
          }
        )

        const researcherID = 'res' + idToken.payload.sub

        if (response && response.ok) {
          dispatch({
            type: StateActions.CreateLocalUser,
            payload: {
              user: {
                researcherID,
                email,
                name: `${firstName} ${lastName}`,
                organization,
                firstName,
                lastName,
              },
            },
          })
        } else {
          setFormMessage('Error creating user')
        }

        setSubmitting(false)
      } catch (error) {
        console.error({ error })
        setSubmitting(false)
        setFormMessage('Error creating user')
      }
      setSubmitting(false)
      navigate('/projects/')
    } catch (error) {
      console.error({ error })
      const { message } = error as { code: string; message: string }
      setFormMessage(message)
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <H1>Sign up</H1>
      <p>
        Already have an account? <Link to={`/login/`}>Sign in here.</Link>
      </p>
      {createUserResponse && createUserResponse.userConfirmed === false ? (
        <Form onSubmit={handleSubmitConfimation}>
          <Label>
            Confirmation Code
            <Input
              type="text"
              spellCheck="false"
              ref={firstInputRef}
              onChange={e => setConfirmationCode(e.target.value)}
              value={confirmationCode}
            />
          </Label>
          {formMessage && (
            <ColorMessage status={ColorMessageStatus.Warning}>
              {formMessage}
            </ColorMessage>
          )}
          <MintButton
            type="submit"
            style={{ marginTop: 40 }}
            disabled={submitting}
          >
            {submitting ? 'loading...' : 'Sign up'}
          </MintButton>
        </Form>
      ) : (
        <Form onSubmit={handleSubmitCreate}>
          <Label>
            First name*
            <Input
              type="text"
              spellCheck="false"
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
          </Label>
          <Label>
            Last name*
            <Input
              type="text"
              spellCheck="false"
              onChange={e => setLastName(e.target.value)}
              value={lastName}
            />
          </Label>
          <Label>
            Email*
            <Input
              type="email"
              spellCheck="false"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </Label>
          <Label>
            Password*
            <Input
              type="password"
              spellCheck="false"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </Label>
          <p>Password must be at least 8 characters long.</p>
          <Label>
            Affiliation
            <Input
              type="text"
              spellCheck="false"
              onChange={e => setOrganization(e.target.value)}
              value={organization}
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
            {submitting ? 'loading...' : 'Sign up'}
          </MintButton>
        </Form>
      )}
    </Container>
  )
}

export default SignUp
