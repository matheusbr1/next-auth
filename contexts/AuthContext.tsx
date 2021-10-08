import { createContext, useEffect, useState } from "react";
import Router from 'next/router'
import { api } from "../services/apiClient"
import { setCookie, parseCookies, destroyCookie } from 'nookies'

type SignInCredentials = {
  email: string
  password: string
}

type AuthProvider = {
  children: React.ReactNode
}

type User = {
  email: string
  permissions: string[]
  roles: string[]
} | null

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut:() => void
  user: User
  isAuthenticated: boolean
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export function signOut () {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')
  Router.push('/')

  authChannel.postMessage('signOut')
}

export function AuthProvider({ children }: AuthProvider) {
  const [user, setUser] = useState<User>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut()   
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      api.get('me').then(response => {
        const { email, permissions, roles } = response.data

        setUser({
          email,
          permissions,
          roles
        })
      }).catch(() => {
        signOut()
      })
    }
  }, [])



  async function signIn({ email, password }: SignInCredentials) {

    try {
      const payload = {
        email,
        password
      }

      const response = await api.post('sessions', payload)

      console.log(payload)

      const { permissions, roles, refreshToken, token } = response.data  

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
  
      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      signIn,
      signOut,
      user
    }} >
      {children}
    </AuthContext.Provider>
  )
}