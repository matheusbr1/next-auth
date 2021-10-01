import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import api from "../services/api"

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