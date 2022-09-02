import React from 'react'
import styled from 'styled-components'
import CMS from '@talus-analytics/library.airtable-cms'

import NavLink from './NavLink'

import MobileMenu from './MobileMenu/MobileMenu'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import useUser from 'hooks/useUser'
import { UserStatus } from '../../Login/UserContextProvider'

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.darkPurple};
  position: sticky;
  top: 0px;
  width: 100%;
  z-index: 50;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.24);
  border-bottom: 1px solid black;
`
const Container = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`
const LinkList = styled.ol`
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
`
const HomeLink = styled(NavLink)`
  font-family: 'Overpass', sans-serif !important;
  font-weight: 500 !important;
  font-size: 24px !important;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
  margin-left: 20px;
`
const DesktopNav = styled(LinkList)`
  @media (max-width: 599px) {
    display: none;
  }
`
const MobileLinkList = styled(LinkList)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.darkPurple};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`
const NavLogo = styled(CMS.Image)`
  height: 70px;
  margin-right: 20px;
`

const NavBar = () => {
  const data = useIndexPageData()

  const user = useUser()

  const links = [
    { to: '/about/', label: 'About' },
    { to: '/guide/', label: 'User guide' },
  ]

  if (user.status === UserStatus.loggedIn)
    links.push({ to: '/app/#/projects', label: user.data?.name || '' })
  else links.push({ to: '/app/#/login', label: 'Sign in' })

  // to={user.status === UserStatus.loggedIn ? '/app/' : '/'}>

  return (
    <Nav>
      <Container>
        <LinkList>
          <HomeLink to="/">
            <NavLogo name="Site logo" data={data} />
            <CMS.Text name="Navbar title" data={data} />
          </HomeLink>
        </LinkList>
        <DesktopNav>
          {links.map(link => (
            <NavLink key={link.label} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </DesktopNav>
        <MobileMenu>
          <MobileLinkList>
            {links.map(link => (
              <NavLink key={link.label} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </MobileLinkList>
        </MobileMenu>
      </Container>
    </Nav>
  )
}

export default NavBar
