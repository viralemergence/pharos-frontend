import React from 'react'
import styled from 'styled-components'
import Expander from './'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  border: 1px solid saddlebrown;
  padding: 15px;
  margin-top: 2px;
  border-radius: 5px;
`

export const RelativePosition = () => {
  const [open, setOpen] = React.useState(true)
  return (
    <Wrapper>
      <div style={{ width: 500, height: 300 }}>
        <button onClick={() => setOpen(prev => !prev)}>
          {open ? 'Hide content' : 'Show content'}
        </button>
        <Expander open={open}>
          <Container>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Container>
        </Expander>
        <p>Other content</p>
      </div>
    </Wrapper>
  )
}

export const Floating = () => {
  const [open, setOpen] = React.useState(true)
  return (
    <Wrapper>
      <div style={{ width: 500, height: 300 }}>
        <button onClick={() => setOpen(prev => !prev)}>
          {open ? 'Hide content' : 'Show content'}
        </button>
        <Expander floating open={open} style={{ maxWidth: '80%' }}>
          <Container>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Container>
        </Expander>
        <p>Other content</p>
      </div>
    </Wrapper>
  )
}
