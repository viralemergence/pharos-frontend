import React from 'react'
import styled from 'styled-components'

const SpinnerAnimation = styled.div<{ scale: number; color: string }>`
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
  transform: scale(${({ scale }) => scale});

  > div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 4px;
    border: 4px solid ${({ color }) => color};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ color }) => color} transparent transparent transparent;
  }
  > div:nth-child(1) {
    animation-delay: -0.45s;
  }
  > div:nth-child(2) {
    animation-delay: -0.3s;
  }
  > div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

interface LoadingSpinnerProps {
  scale?: number
  style?: React.CSSProperties
  color?: string
}

const LoadingSpinner = ({
  scale = 1,
  style,
  color = '#fff',
}: LoadingSpinnerProps) => (
  <SpinnerAnimation scale={scale} style={style} color={color}>
    <div />
    <div />
    <div />
    <div />
  </SpinnerAnimation>
)

export default LoadingSpinner
