import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { UserStatus } from 'components/Login/UserContextProvider'
import useUser from 'hooks/useUser'

function RequireAuth({ children }: { children: JSX.Element }) {
  const [user] = useUser()
  const location = useLocation()

  if (user.status !== UserStatus.loggedIn) {
    return (
      <Navigate
        to={{ pathname: '/login', search: `?next=${location.pathname}` }}
        replace
      />
    )
  }

  return children
}

export default RequireAuth
