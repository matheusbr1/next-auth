type User = {
  permissions: string[]
  roles: string[]
}

type ValidateUserPermisssionsParams = {
  user: User
  permissions?: string[]
  roles?: string[]
}

export function validateUserPermisssions({
  user,
  permissions, 
  roles
}: ValidateUserPermisssionsParams) {
  if (permissions?.length) {
    const hasAllPermissions = permissions.every(permission => {
      return user?.permissions.includes(permission)
    })
  
    if (!hasAllPermissions) {
      return false
    }
   }
  
   if (roles?.length) {
    const hasAllroles = roles.some(role => {
      return user?.roles.includes(role)
    })
  
    if (!hasAllroles) {
      return false
    }
   }
  
   return true
}