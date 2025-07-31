'use client'

import IconifyIcon from '@/core/icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl, FormHelperText, FormLabel, InputAdornment, TextField } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  identity: z.string(),
  password: z.string().min(5, { message: 'Kata sandi harus memiliki setidaknya 5 karakter' }),
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, startTransition] = useTransition()
  const defaultValues: UserFormValue = {
    password: '',
    identity: '',
  }
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      const sign = await signIn('credentials', {
        identity: data.identity,
        password: data.password,
        redirect: false,
      }).catch(() => {
        return false
      })
      if (!sign) toast.error('Sign In Failed!')
      else {
        router.push(callbackUrl || '/x')
        toast.success('Signed In Successfully!')
      }
    })
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: '100%', spaceY: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <FormControl>
        <FormLabel htmlFor="identity">NIS Anda</FormLabel>
        <Controller
          name="identity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={loading}
              type="identity"
              placeholder="231xxx112"
              autoComplete="identity"
              autoFocus
              required
              fullWidth
              variant="outlined"
              error={Boolean(errors.identity)}
            />
          )}
        />
        {errors.identity && <FormHelperText sx={{ color: 'error.main' }}>{errors.identity.message}</FormHelperText>}
      </FormControl>
      <FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormLabel htmlFor="password">Password</FormLabel>
        </Box>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={loading}
              placeholder="••••••"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              error={Boolean(errors.password)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <IconifyIcon icon="ph:eye-slash" /> : <IconifyIcon icon="ph:eye" />}
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
      </FormControl>
      <Button type="submit" disabled={loading} fullWidth variant="contained">
        Masuk
      </Button>
    </Box>
  )
}
