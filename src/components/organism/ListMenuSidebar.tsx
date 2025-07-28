'use client'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { SquaresExclude, ListOrdered, Car } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Else, If } from '../atoms/if'

export default function ListMenuSidebar({
  sidebarCollapsed,
}: {
  readonly sidebarCollapsed: boolean
}) {
  const pathName = usePathname()
  return (
    <nav className="!px-2 !py-4 space-y-1 ">
      <div className="space-y-1">
        <If condition={!sidebarCollapsed}>
          <Button
            variant={pathName === '/admin/cars' ? 'contained' : 'text'}
            href="/admin/cars"
            startIcon={<Car />}
            size="small"
            className={`!shadow-none !w-full flex !justify-start`}
            color={pathName === '/admin/cars' ? 'primary' : 'inherit'}
            classes={{
              root:
                pathName === '/admin/cars'
                  ? 'group flex items-center gap-1 !px-3 !py-2 text-sm font-medium rounded-lg transition-colors duration-150 !text-black hover:!bg-primary-600 !text-white'
                  : '!text-black ',
            }}
          >
            {!sidebarCollapsed && 'cars'}
          </Button>
          <Else key="else-1">
            <IconButton
              href="/admin/cars"
              aria-label="dashboard"
              color={pathName === '/admin/cars' ? 'primary' : 'default'}
            >
              <SquaresExclude />
            </IconButton>
          </Else>
        </If>
        <If condition={!sidebarCollapsed}>
          <Button
            variant={pathName === '/admin/orders' ? 'contained' : 'text'}
            href="/admin/orders"
            startIcon={<ListOrdered />}
            size="small"
            className={`!shadow-none !w-full flex !justify-start`}
            color={pathName === '/admin/orders' ? 'primary' : 'inherit'}
            classes={{
              root:
                pathName === '/admin/orders'
                  ? 'group flex items-center gap-1 !px-3 !py-2 text-sm font-medium rounded-lg transition-colors duration-150 !text-black hover:!bg-primary-600 !text-white'
                  : '!text-black ',
            }}
          >
            {!sidebarCollapsed && 'orders'}
          </Button>
          <Else key="else-1">
            <IconButton
              href="/admin/orders"
              aria-label="dashboard"
              color={pathName === '/admin/orders' ? 'primary' : 'default'}
            >
              <SquaresExclude />
            </IconButton>
          </Else>
        </If>
      </div>
    </nav>
  )
}
