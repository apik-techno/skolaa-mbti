'use client'

import IconifyIcon from '@/core/components/icon'
import { Button } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function GithubSignInButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  return (
    <Button
      fullWidth
      variant="outlined"
      type="button"
      onClick={() => signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })}
      startIcon={<IconifyIcon icon="mdi:github" />}
    >
      Continue with Github
    </Button>
  )
}
