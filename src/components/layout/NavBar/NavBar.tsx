import React from 'react'
import styled from 'styled-components'
import { useLocation as useReachLocation } from '@reach/router'

import CMS from '@talus-analytics/library.airtable-cms'

import NavLink, { LogoutButton } from './NavLink'
import MobileMenu from './MobileMenu/MobileMenu'

import { UserStatus } from 'reducers/stateReducer/types'

import useIndexPageData from 'cmsHooks/useIndexPageData'
import useAppState from 'hooks/useAppState'
import localforage from 'localforage'

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
  padding: 0;
  display: flex;
  align-items: center;
  margin-left: 20px;
`
const DesktopNav = styled(LinkList)`
  @media (max-width: 699px) {
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
  margin-right: 30px;
  margin-left: 12px;
  @media (max-width: 400px) {
    margin-right: 0px;
  }
`

const NavBar = () => {
  const data = useIndexPageData()
  const { user } = useAppState()

  // Combining these routers is a mess because of S3...

  // Long story short, reach router works for all server-side paths
  // which actually exist in the S3 bucket.

  // /app/ is the location of the SPA, and inside the SPA all routing
  // is handled by react-router-dom. this "insideAppRouting" variable
  // lets us build conditionals to reder either react router links
  // or gatsby reach-router links based on whether we are on a static
  // page or a page of the SPA with client-side routing.
  const gatsbyLocation = useReachLocation()
  const insideAppRouting = gatsbyLocation.pathname.startsWith('/app/')

  // these links are always the same, and always reach-router
  const links = [
    { to: '/data/', children: 'Data', reactRouterLink: false },
    { to: '/about/', children: 'About', reactRouterLink: false },
    // { to: '/user-guide/', children: 'User guide', reactRouterLink: false },
  ]

  // the last link in the navbar switches text, path, and component
  if (user.status === UserStatus.loggedIn)
    // if the user is logged in, the last link will be their username
    // and clicking it should route to the projects page.

    // if they are on a static page, the link should be a reach-router
    // link to the full pathname + hash path, but if they are already
    // on a client-routed app page, the link should be a react-router
    // link to just the hash path (no /app/#/).
    links.push({
      to: insideAppRouting ? '/projects/' : '/app/#/projects/',
      children: user.data?.name || '',
      reactRouterLink: insideAppRouting,
    })
  // if user is logged out, the last link should be a reach-router
  // link that points at the full pathname + hash of the login page
  else
    links.push({
      to: '/app/#/login',
      children: 'Sign in',
      reactRouterLink: false,
    })

  return (
    <Nav>
      <Container>
        <LinkList>
          <HomeLink to="/" reactRouterLink={false}>
            <NavLogo
              name="Site logo"
              data={data}
              style={{ height: 70, width: 200 }}
            />
          </HomeLink>
        </LinkList>
        <DesktopNav>
          {links.map(link => (
            <NavLink key={link.to} {...link} />
          ))}
          {user.status === UserStatus.loggedIn && (
            <LogoutButton
              onClick={() => {
                // this is a very aggressive temporary implementation
                // of "log out" because it deletes all the local data
                // without warning the user; this way we can use it
                // as a "reset" button if a bug traps the user.
                localforage.clear()
                window.location.href = '/'
                window.location.reload()
              }}
            >
              Logout
            </LogoutButton>
          )}
        </DesktopNav>
        <MobileMenu>
          <MobileLinkList>
            {links.map(link => (
              <NavLink key={link.to} {...link} />
            ))}
            {user.status === UserStatus.loggedIn && (
              <LogoutButton
                onClick={() => {
                  // this is a very aggressive temporary implementation
                  // of "log out" because it deletes all the local data
                  // without warning the user; this way we can use it
                  // as a "reset" button if a bug traps the user.
                  localforage.clear()
                  window.location.href = '/'
                  window.location.reload()
                }}
              >
                Logout
              </LogoutButton>
            )}
          </MobileLinkList>
        </MobileMenu>
      </Container>
    </Nav>
  )
}

export default NavBar
