export const cookie = {
  BARIER: 'x-barier-token',
  TOKEN: 'x-access-token',
  ROLE: 'x-access-role',
  CSRF: 'x-csrf-token',
  CALLBACK: 'x-callback-token',
  SETTING: 'x-access-setting',
  PERMISSION: 'x-access-permission',
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`
}

export function getLocalUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }

  if (process.env.NODE_ENV === 'production' && process.env.HOSTNAME) {
    return `http://${process.env.HOSTNAME ?? '127.0.0.1'}:${process.env.PORT ?? 3000}`
  }
  // assume localhost
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`
}

export const PATHS = {
  ACCOUNT_ACTIVATION: '/activation',
}

export const allowRoles: [string, ...string[]] = ['admin', 'user']
