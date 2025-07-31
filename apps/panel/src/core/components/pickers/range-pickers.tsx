// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import DatePickerWrapper from '@/core/styles/react-datepicker'
import { SxProps, Theme } from '@mui/material'
import { format } from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Types
export type DateType = Date | null

interface PickerProps {
  label?: string
  error?: boolean
  end: Date | number
  start: Date | number
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
}

const PickersRange = ({
  value,
  inputLabel,
  disabled,
  onChange,
  minDate,
  error,
  maxDate,
  inputSx,
  inputSize,
}: {
  value?: [DateType, DateType]
  inputLabel?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  error?: boolean
  onChange: (dates: [DateType, DateType]) => void
  inputSx?: SxProps<Theme>
  inputSize?: 'small' | 'medium'
}) => {
  // ** States
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleOnChange = (dates: [DateType, DateType]) => {
    const [start, end] = dates
    setStartDate(start || undefined)
    setEndDate(end || undefined)
    onChange(dates)
  }

  useEffect(() => {
    setStartDate(value?.[0] || undefined)
    setEndDate(value?.[1] || undefined)
  }, [value])

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = props?.start ? format(props?.start, 'dd MMM yyyy HH:mm') : null
    const endDate = props?.end && props.end !== null ? ` - ${format(props.end, 'dd MMM yyyy HH:mm')}` : null

    const value = `${startDate || ''}${endDate || ''}`

    return (
      <TextField
        autoComplete="off"
        aria-autocomplete="none"
        fullWidth
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
        selectsRange
        showYearDropdown
        showMonthDropdown
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        endDate={endDate}
        selected={startDate}
        startDate={startDate}
        id="date-range-picker"
        onChange={handleOnChange}
        shouldCloseOnSelect={false}
        customInput={
          <CustomInput
            label={inputLabel || 'Date Range'}
            size={inputSize}
            error={error}
            sx={inputSx}
            start={startDate as Date | number}
            end={endDate as Date | number}
          />
        }
      />
    </DatePickerWrapper>
  )
}

export default PickersRange
