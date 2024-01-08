import React, { useState } from 'react'
import styled from 'styled-components'
import { Auth } from 'aws-amplify'

import Main from 'components/layout/Main'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import MintButton, { buttonStyle } from 'components/ui/MintButton'
import { Link } from 'react-router-dom'

const Container = styled(Main)`
  max-width: 505px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`
const Form = styled.form`
  margin-top: 40px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h1}
`
const MintButtonReactRouterLink = styled(Link)`
  ${buttonStyle}
`

const ResetPassword = () => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [passwordResetCode, setPasswordResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await Auth.forgotPasswordSubmit(email, passwordResetCode, newPassword)
      setSubmitting(false)
      setSuccess(true)
      setFormMessage('Password reset, please continue to sign in')
    } catch (err) {
      setSubmitting(false)
      console.log(err)

      if ((err as { message: string }).message)
        setFormMessage((err as { message: string }).message)
      else setFormMessage('Error resetting password')
    }
  }

  return (
    <Container>
      <H1>Reset Password</H1>
      <Form onSubmit={handleSubmit}>
        <Label>
          Email address
          <Input
            autoFocus
            type="text"
            spellCheck="false"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </Label>
        <Label>
          Password reset code
          <Input
            autoFocus
            type="text"
            spellCheck="false"
            onChange={e => setPasswordResetCode(e.target.value)}
            value={passwordResetCode}
          />
        </Label>
        <Label>
          New password
          <Input
            autoFocus
            type="password"
            spellCheck="false"
            onChange={e => setNewPassword(e.target.value)}
            value={newPassword}
          />
        </Label>
        <p>{formMessage}</p>
        {!success && (
          <MintButton
            type="submit"
            style={{ marginTop: 40 }}
            disabled={submitting || success}
          >
            {submitting ? 'Loading...' : 'Reset'}
          </MintButton>
        )}
        {success && (
          <MintButtonReactRouterLink to="/login/">
            Go to login
          </MintButtonReactRouterLink>
        )}
      </Form>
    </Container>
  )
}

export default ResetPassword
