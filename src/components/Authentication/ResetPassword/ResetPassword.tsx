import React, { useState } from 'react'
import styled from 'styled-components'
import { Auth } from 'aws-amplify'

import Main from 'components/layout/Main'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'
import MintButton from 'components/ui/MintButton'

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

const ResetPassword = () => {
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [passwordResetCode, setPasswordResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const handleSubmit = async (_: React.FormEvent<HTMLFormElement>) => {
    setSubmitting(true)
    try {
      const data = await Auth.forgotPasswordSubmit(
        email,
        passwordResetCode,
        newPassword
      )
      console.log(data)
      setSubmitting(false)
      setFormMessage('Password reset')
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
        <MintButton
          type="submit"
          style={{ marginTop: 40 }}
          disabled={submitting}
        >
          {submitting ? 'Loading...' : 'Reset'}
        </MintButton>
      </Form>
    </Container>
  )
}

export default ResetPassword
