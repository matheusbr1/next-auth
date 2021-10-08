import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validateUserPermisssions } from "../utils/validateUserPermisssions";

interface UseCanProps {
  permissions?: string[]
  roles?: string[]
}

export function useCan ({ permissions, roles }: UseCanProps) {
 const { user, isAuthenticated }  = useContext(AuthContext)

 if (!isAuthenticated) {
   return false
 }

 const userHasValidPermissions = validateUserPermisssions({
   user: user as any,
   permissions,
   roles
 })

 return userHasValidPermissions
}