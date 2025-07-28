'use client'

import React, { useEffect, useState } from 'react'
import { Orders } from '@/type/Orders'
import DataTable, { type Column } from '@/components/molecules/DataTable'
import { useApi } from '@/composable/useApi'
import { Button } from '@mui/material'
import { differenceInDays, differenceInMonths, format } from 'date-fns'
import Modal from '@/components/atoms/Modal'
import { useRouter } from 'next/navigation'
import { useRoute } from '@/composable/useRoute'
import { useComputed } from '@/composable/useComputed'
import { Cars } from '@/type/Cars'
import Image from 'next/image'
import { queryClient } from '@/utils/queryClient'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface AddColumn extends Orders {
  intervalOrders?: string
  actions?: () => void
  id?: string
}
export default function Page() {
  const [open, setOpen] = useState(false)
  const [idDelete, setIdDelete] = useState('')

  const router = useRouter()
  const route = useRoute()
  const [params, setParams] = useState<{
    page: number
    limit: number
    car_id: string
    order_data: string
  }>({
    page: 1,
    limit: 10,
    car_id: '',
    order_data: format(new Date(), 'yyyy-MM-dd'),
  })
  const [selected, setSelected] = useState<Orders>({
    car_id: '',
    dropoff_date: '',
    dropoff_location: '',
    order_date: '',
    pickup_date: '',
    pickup_location: '',
  })

  const filterParams = useComputed(() => {
    if (!route.origin) return ''
    const url = new URL('/admin/orders', route.origin)
    url.searchParams.append('id', params.car_id)
    url.searchParams.append('order_date', params.order_data)
    return url.search
  })

  const { data: CarsData } = useApi<Cars[], Cars[]>({
    url: '/cars',
    queryKey: ['cars-get'],
    enabled: !!params.car_id,
  })

  const getCars = useComputed(
    () => CarsData?.filter((item) => item.id === route.query.car_id) || []
  )

  useEffect(() => {
    if (route.query.car_id) {
      setOpen(true)
      setParams((prevState) => {
        return {
          ...prevState,
          car_id: route.query.car_id,
        }
      })
    }
  }, [route.query.car_id])

  const { data, isPending } = useApi<Orders[], AddColumn[]>({
    url: '/orders' + filterParams.value,
    queryKey: ['/orders', filterParams.value.slice(1)],
  })

  const { mutate: deleteOrders } = useApi<{ id: string }, { id: string }>({
    url: '/orders/' + idDelete,
    method: 'DELETE',
    onSuccess: () => {
      // setIdDelete('')
      queryClient.invalidateQueries({
        queryKey: ['/orders', filterParams.value.slice(1)],
      })
    },
  })

  const intervalDate = (e?: Orders) => {
    if (!e) return 0
    const startDate = new Date(e.pickup_date ?? new Date())
    const endDate = new Date(e.dropoff_date ?? new Date())
    const result = differenceInDays(endDate, startDate)
    const checkExisting = isNaN(result) ? 0 : result
    return result === 0 ? 1 : checkExisting
  }

  const intervalMonth = (e?: Orders) => {
    if (!e) return 0
    const startDate = new Date(e.pickup_date ?? new Date())
    const endDate = new Date(e.dropoff_date ?? new Date())
    const result = differenceInMonths(endDate, startDate)
    const checkExisting = isNaN(result) ? 0 : result
    const checkIsNan = isNaN(result) ? 0 : result
    return checkExisting ? 0 : checkIsNan
  }

  const columns: Column<AddColumn>[] = [
    {
      label: 'Tanggal order',
      accessor: 'order_date',
      render: (row) => {
        return <div>{row.order_date}</div>
      },
    },
    {
      label: 'Tanggal Pickup',
      accessor: 'pickup_date',
      render: (row) => {
        return <div>{row.pickup_date}</div>
      },
    },
    {
      label: 'Tanggal Dropoff',
      accessor: 'dropoff_date',
      render: (row) => {
        return <div>{row.dropoff_date}</div>
      },
    },
    {
      label: 'Lokasi Dropoff',
      accessor: 'dropoff_location',
      render: (row) => {
        return <div>{row.dropoff_location}</div>
      },
    },
    {
      label: 'Lokasi Pickup',
      accessor: 'pickup_location',
      render: (row) => {
        return <div>{row.pickup_location}</div>
      },
    },
    {
      label: 'Interval Order',
      accessor: 'intervalOrders',
      render: (row) => {
        return (
          <div>
            {intervalDate(row) ?? 0} Hari / {intervalMonth(row)} Bulan
          </div>
        )
      },
    },
    {
      label: '',
      accessor: 'actions',
      render: (row) => {
        return (
          <div>
            <Button
              color="info"
              onClick={() => {
                const detailParams = new URL(route.origin + '/admin/orders')
                detailParams.searchParams.append('car_id', String(row.car_id))
                setSelected(row)
                setParams((prevState) => {
                  return {
                    ...prevState,
                    car_id: String(row.car_id),
                  }
                })
                router.push(detailParams.pathname + detailParams.search)
                setOpen(true)
              }}
            >
              Detail
            </Button>
            <Button
              onClick={() => {
                setIdDelete(row.id ? row.id : '')
              }}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]
  return (
    <div>
      <div className="flex items-center justify-between my-5">
        <div className="text-2xl font-bold">Report Orders</div>
        <div>
          {' '}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={'Search Order Date'}
              slotProps={{ textField: { size: 'small' } }}
              name="startDate"
              onChange={(newValue) =>
                setParams((prevState) => {
                  return {
                    ...prevState,
                    order_data: format(
                      String(newValue ?? new Date()),
                      'yyyy-MM-dd'
                    ),
                  }
                })
              }
            />
          </LocalizationProvider>
        </div>
      </div>
      <Modal
        open={!!idDelete}
        setOpen={() => setIdDelete('')}
        contentText="Apakah kamu yakin akan menghapus order?"
        title="Hapus orders"
      >
        <div className="pb-5 mt-5">
          <div className="flex gap-3">
            <Button variant="outlined" onClick={() => setIdDelete('')}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteOrders({ id: idDelete })
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={open}
        setOpen={() => {
          router.push('/admin/orders')
          setParams((prevState) => {
            return {
              ...prevState,
              car_id: '',
            }
          })
          setOpen(false)
        }}
        title="Detail Orders"
        contentText=""
      >
        <div className="pb-5">
          <div>
            {getCars.value && (
              <Image
                src={getCars.value?.[0]?.image ?? ''}
                alt="cars"
                width={300}
                height={300}
                unoptimized
                className="rounded-lg"
              />
            )}
            <div className="text-xl font-bold mt-3">
              {getCars.value?.[0]?.name}
            </div>
            <div className="mt-3">
              <div className="flex flex-row gap-5">
                Total Tarif Harga Harian:{' '}
                <span>
                  Rp.
                  {isNaN(
                    Number(
                      intervalDate(selected) *
                        Number(getCars.value?.[0]?.day_rate)
                    )
                  )
                    ? 0
                    : Number(
                        intervalDate(selected) *
                          Number(getCars.value?.[0]?.day_rate)
                      ).toLocaleString('id-ID')}
                </span>{' '}
              </div>
              <div className="flex flex-row gap-3">
                Total Tarif Harga Bulanan:{' '}
                <span>
                  Rp.
                  {isNaN(
                    Number(
                      intervalMonth(selected) *
                        Number(getCars.value?.[0]?.month_rate)
                    )
                  )
                    ? 0
                    : Number(
                        intervalMonth(selected) *
                          Number(getCars.value?.[0]?.month_rate)
                      ).toLocaleString('id-ID')}
                </span>{' '}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <DataTable fields={columns} items={data ?? []} loading={isPending} />
    </div>
  )
}
