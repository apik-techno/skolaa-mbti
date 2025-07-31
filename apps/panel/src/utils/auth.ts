import { auth } from '@/auth'

export const checkMe = async (isLoginPage = false) => {
  let tokenValid = false
  try {
    const token = await auth()
    if (token) {
      tokenValid = true
      console.log(token?.user)
    }
  } catch (e) {
    if (e instanceof Error) console.log('[ERRR]', e.message)
  }
  let redirectPath: string | null = null
  try {
    if (isLoginPage && tokenValid) redirectPath = '/'
    else if (!isLoginPage && !tokenValid) redirectPath = '/login'
  } catch (error) {
    if (error instanceof Error) console.log('[AUTH]', error)
  }
  return redirectPath
}

export const checkRole = async (allowRoles: string[]) => {
  let tokenValid = false
  let roleValid = false
  try {
    const token = await auth()
    if (token) {
      tokenValid = true
      const user = token.session
      if (user.role && allowRoles.includes(user.role)) roleValid = true
    }
  } catch (e) {
    if (e instanceof Error) console.log('[ERRR]', e.message)
  }
  let redirectPath: string | null = null
  try {
    if (!tokenValid) redirectPath = '/login'
    else if (!roleValid) redirectPath = '/'
  } catch (error) {
    if (error instanceof Error) console.log('[AUTH]', error)
  }
  return redirectPath
}
