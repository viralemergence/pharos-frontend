import React from 'react'

import Main from 'components/layout/Main'
import useUser from 'hooks/useUser'

const ResearcherHome = () => {
  const [user] = useUser()

  return (
    <Main>
      <h1>Researcher Home</h1>
      <h2>Logged in as {user.data?.name}</h2>
    </Main>
  )
}

export default ResearcherHome
