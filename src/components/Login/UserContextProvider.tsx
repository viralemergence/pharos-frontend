import React, { createContext, useState } from 'react'

export enum UserStatus {
  'loggedOut',
  'loggedIn',
  'sessionExpired',
  'invalidUser',
  'authError',
}

export enum View {
  'home',
  'datagrid',
}

export interface User {
  status: UserStatus
  statusMessage: string
  view?: View
  data?: {
    researcherID: string
    organization: string
    email: string
    name: string
  }
}

export type UserContext = [User, React.Dispatch<React.SetStateAction<User>>]

export const UserContext = createContext<UserContext | null>(null)
interface CMSIconProviderProps {
  children: React.ReactNode
}

export const defaultUserState = {
  status: UserStatus.loggedOut,
  statusMessage: 'Logged out',
  view: View.home,
}

const UserContextProvider = ({
  children,
}: CMSIconProviderProps): JSX.Element => {
  const [user, setUser] = useState<User>(defaultUserState)

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
