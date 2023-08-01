import React from 'react'

import styled from 'styled-components'

const Button = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  background-color: rgba(0, 0, 0, 0);
  transition: 150ms ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);

  &:hover {
    background-color: ${({ theme }) => theme.white10PercentOpacity};
    border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  }
`

const CloseButton = (props: React.HTMLAttributes<HTMLButtonElement>) => (
  <Button {...props}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_4585_42387)">
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_4585_42387">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </Button>
)

export default CloseButton
