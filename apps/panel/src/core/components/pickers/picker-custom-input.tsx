// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

interface PickerProps {
  label?: string
  value?: string
  readOnly?: boolean
  required?: boolean
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, value, readOnly } = props

  return (
    <TextField
      inputRef={ref}
      {...props}
      autoComplete="off"
      onChange={(e) => e.preventDefault()}
      fullWidth
      value={value}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

PickersComponent.displayName = 'PickersComponent'

export default PickersComponent
