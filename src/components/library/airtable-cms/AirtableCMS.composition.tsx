import React from 'react'
import styled from 'styled-components'

// @ts-ignore
import logo from './assets/logo.png'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const Logo = () => (
  <Container>
    <Image src={logo} alt="Airtable logo" />
  </Container>
)
