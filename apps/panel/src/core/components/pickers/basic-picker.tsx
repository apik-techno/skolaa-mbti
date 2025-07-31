// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from './picker-custom-input'
import { DateType } from './range-pickers'

// ** Types

const PickersBasic = ({
  label,

  value,
  onChange,
  ...rest
}: {
  value?: DateType
  label?: string
  disabled?: boolean
  error?: boolean
  required?: boolean
  onChange: (dates: DateType) => void
}) => {
  // ** States
  const [date, setDate] = useState<DateType>(new Date())
  const handleOnChange = (date: DateType) => {
    setDate(date)
    onChange(date)
  }
  useEffect(() => {
    setDate(value || null)
  }, [value])
  return (
    <DatePicker
      {...rest}
      selected={date}
      showYearDropdown
      showMonthDropdown
      onChange={handleOnChange}
      popperProps={{
        strategy: 'fixed',
      }}
      dateFormat="dd MMM YYYY"
      placeholderText="Click to select a date"
      customInput={<CustomInput {...rest} readOnly label={label || 'Pilih Tanggal'} />}
    />
  )
}

export default PickersBasic
