import { Box, SxProps, Theme } from '@mui/material'
import React from 'react'

interface ViewQuillProps {
  text: string
  maxHeight?: string
  className?: string
  sx?: SxProps<Theme>
}

const ViewQuill: React.FC<ViewQuillProps> = ({ text, maxHeight = '10rem', className, sx }) => {
  return (
    <Box
      className={className}
      sx={{
        maxHeight,
        overflowY: 'auto',
        p: 4,
        borderRadius: '0.5rem',
        ...sx,
        background: (theme) => theme.palette.background.default,
        '& h1': {
          fontSize: '2rem', // Adjust the size as needed
          fontWeight: 700, // Bold
        },
        '& h2': {
          fontSize: '1.75rem', // Adjust the size as needed
          fontWeight: 600, // Semi-bold
        },
        '& h3': {
          fontSize: '1.5rem', // Adjust the size as needed
          fontWeight: 500, // Medium
        },
        '& h4': {
          fontSize: '1.25rem', // Adjust the size as needed
          fontWeight: 500, // Medium
        },
        '& h5': {
          fontSize: '1rem', // Adjust the size as needed
          fontWeight: 400, // Normal
        },
        '& h6': {
          fontSize: '0.875rem', // Adjust the size as needed
          fontWeight: 400, // Normal
        },
        '& p': {
          fontSize: '1rem', // Adjust the size as needed
          fontWeight: 400, // Normal
        },
      }}
    >
      {text && <div dangerouslySetInnerHTML={{ __html: text }} />}
    </Box>
  )
}

export default ViewQuill
