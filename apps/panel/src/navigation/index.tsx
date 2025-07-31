// ** Type import

import { ACCESS } from '@/constants/access'
import { VerticalNavItemsType } from '@/types/layout'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Beranda',
      icon: 'material-symbols:grid-3x3',
      path: '/x',
      access: [ACCESS.USER],
    },
  ]
}

export default navigation
