import tailwindConfig from '@repo/ui/tailwind.config'

import type { Config } from 'tailwindcss'

const config = {
  ...tailwindConfig,
  content: [...tailwindConfig.content, './src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
} satisfies Config

export default config
