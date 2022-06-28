import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const Li = styled.li`
  display: flex;
`

const StyledLink = styled(Link)`
  color: white !important;
  padding: 14px;
  text-decoration: none;
  transition: 500ms ease;
  font-weight: 400;
  font-family: 'Open sans', Arial, Helvetica, sans-serif;

  &:hover {
    transition: 150ms ease;
    text-decoration: none !important;
    color: ${({ theme }) => theme.colorLightPurple} !important;
  }
`
const defaultActiveStyle = {
  fontWeight: '600',
}

interface Props {
  to: string
  activeStyle?: object
  children: React.ReactNode
  className?: string
}

const NavLink = ({ to, activeStyle, className, ...props }: Props) => (
  <Li>
    <StyledLink
      {...{ props }}
      to={to}
      activeStyle={activeStyle || defaultActiveStyle}
      className={className}
    >
      {props.children}
    </StyledLink>
  </Li>
)

export default NavLink
