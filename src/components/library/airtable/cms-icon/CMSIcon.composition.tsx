import React from 'react'
import styled from 'styled-components'
import AirtableCMSIcon from './BIT_PLAYGROUND_ONLY/DEMO_AirtableCMSIcon'

const BitContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LearnMoreIcon = () => (
  <BitContainer>
    <AirtableCMSIcon
      name="Learn more"
      color={'#45a26a'}
      style={{ height: 50 }}
    />
  </BitContainer>
)

export const SyringeIcon = () => (
  <BitContainer>
    <AirtableCMSIcon name="Syringe" color={'#285582'} style={{ height: 50 }} />
  </BitContainer>
)
