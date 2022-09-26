import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { PageInfo, SiteMap } from '../default'

const SidebarListContainer = styled.ul`
  grid-area: 'sidebar';
  list-style-type: none;
  margin: 0;
  margin-left: -15px;
  max-width: 350px;
  padding: 15px 15px 15px 0;
  border-right: 1px solid ${({ theme }) => theme.darkGray};
`

const SidebarChildren = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const SiteMapLink = styled(Link)`
  ${({ theme }) => theme.bigParagraph};
  color: ${({ theme }) => theme.link};
`

const SidebarSection = ({ siteMap }: { siteMap: SiteMap }) => {
  // the item at `/` will be an index page
  const current = siteMap['/'] as PageInfo

  // all the other keys will be child siteMaps
  const children = Object.entries(siteMap).filter(([key]) => key !== '/') as [
    string,
    SiteMap
  ][]

  return (
    <li>
      {current && <SiteMapLink to={current.path}>{current.title}</SiteMapLink>}
      {children.length > 0 && (
        <SidebarChildren style={{ paddingLeft: 15 }}>
          {children
            .sort((a, b) =>
              typeof a[1]?.['/']?.title === 'string' &&
              typeof b[1]?.['/']?.title === 'string'
                ? a[1]['/'].title.localeCompare(b[1]['/'].title)
                : -1
            )
            .map(([key, child]) => (
              <SidebarSection key={key} siteMap={child} />
            ))}
        </SidebarChildren>
      )}
    </li>
  )
}

const Sidebar = ({ siteMap }: { siteMap: SiteMap }) => {
  return (
    <SidebarListContainer>
      <SidebarSection siteMap={siteMap} />
    </SidebarListContainer>
  )
}

export default Sidebar
