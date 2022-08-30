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
    projects?: string[]
  }
}

export type UserContext = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<UserContext | null>(null)

interface CMSIconProviderProps {
  children: React.ReactNode
}

export const defaultUserState = {
  status: UserStatus.loggedOut,
  statusMessage: 'Logged out',
}

const UserContextProvider = ({
  children,
}: CMSIconProviderProps): JSX.Element => {
  const [user, setUser] = useState<User>(defaultUserState)

  console.log({ user })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
