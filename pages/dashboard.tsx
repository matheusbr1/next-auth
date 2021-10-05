import { destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard () {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('me')
      .then(response => console.log(response.data))
      .catch(error => console.log(error))
  }, [])

  return (
    <>
      <h1>Bem vindo</h1>
      <h1>{ user?.email }</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx as any)
  
  const response = await apiClient.get('me')
  console.log(response.data)

  return {
    props: {}
  }
})