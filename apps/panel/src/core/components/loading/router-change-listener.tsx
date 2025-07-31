'use client'

import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { useEffect, useOptimistic } from 'react'

export function RouteChangeListener() {
  const router = useRouter()
  const [loading, setLoading] = useOptimistic(false)

  useEffect(() => {
    if (router.push.name === 'patched') return
    const push = router.push
    router.push = function patched(...args) {
      setLoading(true)
      // eslint-disable-next-line no-restricted-globals
      push.apply(history, args)
    }
  }, [])

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    if (loading) {
      NProgress.start()
    }
    return () => {
      NProgress.done()
    }
  }, [loading])

  return null
}
