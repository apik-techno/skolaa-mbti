// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports

// ** Third Party Imports
import DatePickerWrapper from '@/core/styles/react-datepicker'
import { SxProps, TextField, Theme } from '@mui/material'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import { DateType } from './range-pickers'

// ** Types
interface PickerProps {
  label?: string
  error?: boolean
  disabled?: boolean
  date: Date | number
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
}
const PickerInline = ({
  value,
  onChange,
  minDate,
  maxDate,
  error,
  inputSx,
  inputSize,
  inputLabel,
  disabled,
}: {
  disabled?: boolean
  value?: DateType
  minDate?: Date
  maxDate?: Date
  error?: boolean
  onChange: (date: DateType) => void
  inputSx?: SxProps<Theme>
  inputSize?: 'small' | 'medium'
  inputLabel?: string
}) => {
  // ** States
  const [date, setDate] = useState<Date>()

  const handleOnChange = (date: DateType) => {
    setDate(date || undefined)
    onChange(date)
  }

  useEffect(() => {
    setDate(value || undefined)
  }, [value])

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const date = props?.date ? format(props?.date, "dd MMM yyyy hh:mm aaaaa'm'") : null

    const value = `${date || ''}`

    return (
      <TextField
        autoComplete="off"
        fullWidth
        disabled={disabled}
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
      />
    )
  })
  CustomInput.displayName = 'CustomInput'

  return (
    <DatePickerWrapper sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
      <DatePicker
        showMonthDropdown
        showTimeSelect
        minDate={minDate}
        maxDate={maxDate}
        selected={date}
        disabled={disabled}
        id="inline-date-picker"
        onChange={handleOnChange}
        customInput={
          <CustomInput
            label={inputLabel || 'Date Range'}
            size={inputSize}
            error={error}
            disabled={disabled}
            sx={inputSx}
            date={date as Date | number}
          />
        }
      />
    </DatePickerWrapper>
  )
}

export default PickerInline
