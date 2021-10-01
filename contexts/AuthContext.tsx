import { createContext } from "react";

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProvider) {
  const isAuthenticated = false

  async function signIn({ email, password }: SignInCredentials) {
    console.log({
      email,
      password
    })
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      signIn
    }} >
      {children}
    </AuthContext.Provider>
  )
}