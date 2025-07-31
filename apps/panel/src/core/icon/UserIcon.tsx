// ** Type Import
import { IconProps } from '@iconify/react'

// ** Custom Icon Import
import Icon from '.'
import { JSX } from 'react'

const UserIcon = ({ icon, ...rest }: IconProps): JSX.Element => {
  return <Icon icon={icon} {...rest} />
}

export default UserIcon
