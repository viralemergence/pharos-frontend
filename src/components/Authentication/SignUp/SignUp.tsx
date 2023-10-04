import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

import Main from 'components/layout/Main'
import Input from 'components/ui/Input'
import Label from 'components/ui/InputLabel'
import MintButton from 'components/ui/MintButton'

import userpool from '../userpool'
import { Link } from 'react-router-dom'
import useUser from 'hooks/useUser'
import useAppState from 'hooks/useAppState'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { UserStatus } from 'reducers/stateReducer/types'
import { CognitoUser } from 'amazon-cognito-identity-js'

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

const confirmUser = (email: string, confirmationCode: string) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userpool,
    })

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

const SignUp = () => {
  const firstInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAppState()
  const dispatch = useDispatch()

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const [submitting, setSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [researcherID, setResearcherID] = useState('')

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = (await registerUser(email, password)) as {
        UserSub: string
        UserConfirmed: boolean
        CodeDeliveryDetails: {
          Destination: string
          DeliveryMedium: string
          AttributeName: string
        }
      }

      console.log(response)

      setResearcherID(response.UserSub)

      dispatch({
        type: StateActions.SetUserStatus,
        payload: {
          status: UserStatus.AwaitingConfirmation,
          statusMessage: 'Please check your email for a confirmation code.',
        },
      })
      setSubmitting(false)
    } catch (err) {
      const error = err as { message: string; __type: string }
      if (error.__type === 'UserNotConfirmedException') {
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AwaitingConfirmation,
            statusMessage: 'Please check your email for a confirmation code.',
          },
        })
      } else
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.InvalidUser,
            statusMessage: (err as { message: string; __type: string }).message,
            cognitoResponseType: (err as { message: string; __type: string })
              .__type,
          },
        })
      setSubmitting(false)
    }
  }

  const handleSubmitConfimation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await confirmUser(email, confirmationCode)

      console.log(response)

      // dispatch({
      //   type: StateActions.SetUserStatus,
      //   payload: {
      //     status: UserStatus.LoggedIn,
      //     statusMessage: (response as { message: string; __type: string })
      //       .message,
      //     cognitoResponseType: (response as { message: string; __type: string })
      //       .__type,
      //   },
      // })
    } catch (err) {
      console.log(err)
      dispatch({
        type: StateActions.SetUserStatus,
        payload: {
          status: UserStatus.AwaitingConfirmation,
          statusMessage: (err as { message: string; __type: string }).message,
          cognitoResponseType: (err as { message: string; __type: string })
            .__type,
        },
      })
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <H1>Sign Up</H1>
      <p>
        Already have an account? <Link to={`/login/`}>sign in here.</Link>
      </p>
      {user.status === UserStatus.AwaitingConfirmation ? (
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
          <ColorMessage status={ColorMessageStatus.Warning}>
            {user.statusMessage}
          </ColorMessage>
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
          {user.statusMessage && (
            <ColorMessage status={ColorMessageStatus.Danger}>
              {user.statusMessage}
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
