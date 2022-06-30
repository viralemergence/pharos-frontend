import React, { createContext } from 'react'

export enum UserStatus {
  'loggedOut',
  'loggedIn',
  'sessionExpired',
  'invalidUser',
  'authError',
}

export interface User {
  status: UserStatus
  data?: {
    researcherID: string
    organization: string
    email: string
    name: string
  }
}

type UserContext = [User, React.Dispatch<React.SetStateAction<User>>]

export const UserContext = createContext<UserContext | null>(null)

export interface CMSIconProviderProps {
  children: React.ReactNode
  data: UserContext
}

const UserContextProvider = ({
  children,
  data,
}: CMSIconProviderProps): JSX.Element => (
  <UserContext.Provider value={data}>{children}</UserContext.Provider>
)

export default UserContextProvider
