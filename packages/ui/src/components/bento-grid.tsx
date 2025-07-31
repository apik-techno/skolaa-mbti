'use client'

import { cn } from '@repo/ui/lib/utils'
import { motion } from 'framer-motion'
export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={cn('grid md:auto-rows grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ', className)}>
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  onClick,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  onClick?: ()=>void
}) => {
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        'cursor-pointer row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-primary/5 border border-transparent justify-between flex flex-col space-y-4',
        className,
      )}
    >
      <div className="header group-hover:shadow-md transition rounded-xl duration-200">{header}</div>
      <div className="transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-1 mt-2">{title}</div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">{description}</div>
      </div>
    </motion.div>
  )
}
