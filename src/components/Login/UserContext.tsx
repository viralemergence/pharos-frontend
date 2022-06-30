import React, { createContext, useState } from 'react'

export enum UserStatus {
  'loggedOut',
  'loggedIn',
  'sessionExpired',
  'invalidUser',
  'authError',
}

export interface User {
  status: UserStatus
  statusMessage: string
  data?: {
    researcherID: string
    organization: string
    email: string
    name: string
  }
}

type UserContext = [User, React.Dispatch<React.SetStateAction<User>>]

export const UserContext = createContext<UserContext | null>(null)
interface CMSIconProviderProps {
  children: React.ReactNode
}

const UserContextProvider = ({
  children,
}: CMSIconProviderProps): JSX.Element => {
  const [user, setUser] = useState<User>({
    status: UserStatus.loggedOut,
    statusMessage: 'Logged out',
  })

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
