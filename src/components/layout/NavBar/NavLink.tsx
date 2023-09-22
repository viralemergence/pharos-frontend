import React from 'react'
import { Link } from 'gatsby'
import { NavLink as ReactRouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

const Li = styled.li`
  display: flex;
`

const linkStyle = css`
  color: white !important;
  padding: 14px;
  text-decoration: none;
  transition: 500ms ease;
  font-weight: 400;
  ${({ theme }) => theme.smallParagraph};

  &:hover {
    transition: 150ms ease;
    text-decoration: none !important;
    color: ${({ theme }) => theme.lightPurple} !important;
  }
`
// applying the same styling to reach-router links
// and react-router-dom links so they look the same
const StyledLink = styled(Link)`
  ${linkStyle}
`
const ReactRouterStyledLink = styled(ReactRouterLink)`
  ${linkStyle}
`

export const LogoutButton = styled.button`
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  ${linkStyle}
  display: flex;
`

const defaultActiveStyle = {
  fontWeight: '600',
}

interface Props {
  to: string
  activeStyle?: object
  children: React.ReactNode
  className?: string
  reactRouterLink?: boolean
}

const NavLink = ({
  to,
  activeStyle,
  className,
  reactRouterLink,
  ...props
}: Props) => (
  <Li>
    {reactRouterLink ? (
      <>
        <ReactRouterStyledLink
          {...{ props }}
          to={to}
          style={({ isActive }) =>
            isActive ? activeStyle || defaultActiveStyle : {}
          }
          className={className}
        >
          {props.children}
        </ReactRouterStyledLink>
      </>
    ) : (
      <StyledLink
        {...{ props }}
        to={to}
        activeStyle={activeStyle || defaultActiveStyle}
        className={className}
      >
        {props.children}
      </StyledLink>
    )}
  </Li>
)

export default NavLink
