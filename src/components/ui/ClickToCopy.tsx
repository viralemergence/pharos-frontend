import React from 'react'
import styled from 'styled-components'

const Container = styled.div<{ darkmode: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${({ theme, darkmode }) =>
    darkmode ? theme.white10PercentOpacity : theme.lightMint};

  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 5px 10px 5px 15px;

  transition: 250ms ease;

  &:hover {
    border: 1px solid
      ${({ theme, darkmode }) => (darkmode ? theme.mint : `rgba(0,0,0,0)`)};

    background-color: ${({ theme, darkmode }) =>
      darkmode ? theme.white20PercentOpacity : theme.hoverMint};
  }

  &:before {
    background-color: ${({ theme }) => theme.mint};
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 5px;
    bottom: -1px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
`
const ChildrenContainer = styled.div<{ showSuccessMessage: boolean }>`
  ${({ theme }) => theme.smallParagraph};
  opacity: ${({ showSuccessMessage }) => (showSuccessMessage ? 0 : 1)};
  transition: 250ms ease;
  overflow-wrap: anywhere;
  width: 100%;
`
const SuccessMessage = styled.div<{
  darkmode: boolean
  showSuccessMessage: boolean
}>`
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: 4px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.smallParagraph};

  background-color: ${({ theme, darkmode }) =>
    darkmode ? theme.white20PercentOpacity : theme.hoverMint};

  border: 1px solid
    ${({ theme, darkmode }) => (darkmode ? theme.mint : theme.hoverMint)};

  opacity: ${({ showSuccessMessage }) => (showSuccessMessage ? 1 : 0)};
`

interface ClickToCopyProps {
  copyContentString: string
  children: React.ReactNode
  darkmode?: boolean
  style?: React.CSSProperties
}

const ClickToCopy = ({
  copyContentString,
  children,
  darkmode = false,
  style,
}: ClickToCopyProps) => {
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(copyContentString)

    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  return (
    <Container darkmode={darkmode} onClick={handleClick} style={style}>
      <ChildrenContainer showSuccessMessage={showSuccessMessage}>
        {children}
      </ChildrenContainer>
      <SuccessMessage
        showSuccessMessage={showSuccessMessage}
        darkmode={darkmode}
      >
        Copied!
      </SuccessMessage>
    </Container>
  )
}

export default ClickToCopy
