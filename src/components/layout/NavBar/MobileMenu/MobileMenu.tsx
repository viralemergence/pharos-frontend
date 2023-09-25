import React from 'react'
import styled from 'styled-components'

import Dropdown from '@talus-analytics/library.ui.dropdown'

import HamburgerButton from '../HamburgerButton/HamburgerButton'

const MenuContainer = styled.div`
  @media (min-width: 700px) {
    display: none;
  }
`

interface MobileMenuProps {
  children: React.ReactNode
}

const MobileMenu = ({ children }: MobileMenuProps) => {
  return (
    <MenuContainer>
      <Dropdown
        expanderStyle={{
          width: '100vw',
          background: 'none',
          right: 0,
          marginTop: 15,
        }}
        renderButton={open => <HamburgerButton open={open} />}
      >
        {children}
      </Dropdown>
    </MenuContainer>
  )
}

export default MobileMenu
