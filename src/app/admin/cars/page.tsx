'use client'

import React, { useEffect, useState } from 'react'
import DataTable, { type Column } from '@/components/molecules/DataTable'
import { useApi } from '@/composable/useApi'
import { Button, debounce, InputAdornment, TextField } from '@mui/material'
import Modal from '@/components/atoms/Modal'
import { useRouter } from 'next/navigation'
import { useRoute } from '@/composable/useRoute'
import { Cars } from '@/type/Cars'
import { queryClient } from '@/utils/queryClient'
import { Search } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddColumn extends Cars {
  intervalOrders?: string
  actions?: () => void
  id?: string
}

const formSchema = z.object({
  name: z.string().min(1, 'Name Required'),
  image: z.string().min(1, 'Image Required'),
  month_rate: z.string().min(1, 'Month Rate Required'),
  day_rate: z.string().min(1, 'Day Rate Required'),
})
export default function Page() {
  const [open, setOpen] = useState(false)
  const [idDelete, setIdDelete] = useState('')

  const router = useRouter()
  const route = useRoute()
  const [params, setParams] = useState<{
    page: number
    limit: number
    name: string
    id?: string
  }>({
    page: 1,
    limit: 10,
    name: '',
    id: '',
  })
  const [selected, setSelected] = useState<Cars>({
    name: '',
    day_rate: '',
    image: '',
    month_rate: '',
  })

  const { data, isPending } = useApi<Cars[], Cars[]>({
    url: '/cars?name=' + params.name,
    queryKey: ['/cars', params.name],
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      month_rate: '',
      day_rate: '',
      image: '',
    },
  })

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
  }, [route])

  const { mutate: deleteCars } = useApi<{ id: string }, { id: string }>({
    url: '/cars/' + idDelete,
    method: 'DELETE',
    onSuccess: () => {
      setIdDelete('')
      queryClient.invalidateQueries({
        queryKey: ['/cars', params.name],
      })
    },
  })

  const columns: Column<AddColumn>[] = [
    {
      label: 'Nama Mobil',
      accessor: 'name',
      render: (row) => {
        return <div>{row.name}</div>
      },
    },
    {
      label: 'Harian',
      accessor: 'day_rate',
      render: (row) => {
        return <div>Rp.{Number(row.day_rate).toLocaleString('id-ID')}</div>
      },
    },
    {
      label: 'Bulanan',
      accessor: 'month_rate',
      render: (row) => {
        return <div>Rp.{Number(row.month_rate).toLocaleString('id-ID')}</div>
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
                setSelected(row)
                const url = new URL('/admin/cars', route.origin)
                url.searchParams.append('id', String(row.id ?? ''))

                router.push(url.pathname + url.search)

                setOpen(true)
              }}
            >
              Update
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

  const { mutate } = useApi<Cars, Cars>({
    url: '/cars',
    method: 'POST',
    body: {
      name: '',
      month_rate: '',
      day_rate: '',
      image: '',
    },
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['/cars', params.name],
      })
    },
  })
  const { mutate: Update } = useApi<Cars, Cars>({
    url: '/cars/' + route.query.id,
    method: 'PUT',
    body: {
      name: '',
      month_rate: '',
      day_rate: '',
      image: '',
    },
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['/cars', params.name],
      })
    },
  })

  function handleSubmit(data: z.infer<typeof formSchema>) {
    if (route.query.id) {
      Update({
        ...data,
        day_rate: data.day_rate.replace(/[.]/g, ''),
        month_rate: data.month_rate.replace(/[.]/g, ''),
      })
    } else {
      mutate({
        ...data,
        day_rate: data.day_rate.replace(/[.]/g, ''),
        month_rate: data.month_rate.replace(/[.]/g, ''),
      })
    }
  }

  React.useEffect(() => {
    form.setValue('name', selected.name)
    form.setValue('day_rate', Number(selected.day_rate).toLocaleString('id-ID'))
    form.setValue('image', selected.image)
    form.setValue(
      'month_rate',
      Number(selected.month_rate).toLocaleString('id-ID')
    )
  }, [selected])

  return (
    <div>
      <div className="flex items-center justify-between my-5">
        <div className="text-2xl font-bold">Mobil</div>
        <div className="flex gap-3">
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            onChange={debounce((e) => {
              setParams((prevState) => {
                return {
                  ...prevState,
                  name: e.target.value,
                }
              })
            }, 300)}
            placeholder="Search Mobil"
            size="small"
          />
          <Button
            variant="contained"
            onClick={() => {
              router.push('/admin/cars')
              setOpen(true)
            }}
          >
            Tambah Mobil
          </Button>
        </div>
      </div>
      <Modal
        open={!!idDelete}
        setOpen={() => setIdDelete('')}
        contentText="Apakah kamu yakin akan menghapus cars?"
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
                deleteCars({ id: idDelete })
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
          setParams((prevState) => {
            return {
              ...prevState,
              car_id: '',
            }
          })
          setOpen(false)
          router.push('/admin/cars')
        }}
        title="Tambah Mobil"
        contentText=""
      >
        <div className="pb-5">
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <div>
                  <label htmlFor="name">Nama Mobil</label>
                  <div>
                    <TextField
                      {...field}
                      id="name"
                      size="small"
                      slotProps={{
                        input: {
                          className:
                            form.formState.errors.name &&
                            '!border !border-red-500',
                        },
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <div>
                  <label htmlFor="choose">Gambar Mobil</label>
                  <div>
                    <TextField
                      id="choose"
                      {...field}
                      slotProps={{
                        input: {
                          className:
                            form.formState.errors?.image &&
                            'border border-red-500',
                        },
                      }}
                      className="w-full"
                      size="small"
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="day_rate"
              render={({ field }) => (
                <div>
                  <label htmlFor="Harian">Harga Harian</label>
                  <div>
                    <TextField
                      id="Harian"
                      {...field}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              Rp.
                            </InputAdornment>
                          ),
                          className:
                            form.formState.errors?.day_rate &&
                            'border border-red-500',
                          onInput: (e) => {
                            const input = e.target as HTMLInputElement
                            if (!input.value) return (input.value = '')
                            if (input.value.startsWith('0')) {
                              input.value = ''
                              return
                            }
                            const value = input.value.replace(/[^\d]/g, '')
                            if (value === '') return (input.value = '')
                            input.value = value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              '.'
                            )
                            field.onChange(input.value)
                          },
                        },
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="month_rate"
              render={({ field }) => (
                <div>
                  <label htmlFor="bulanan">Harga Bulanan</label>
                  <div>
                    <TextField
                      id="bulanan"
                      {...field}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              Rp.
                            </InputAdornment>
                          ),
                          className:
                            form.formState.errors?.month_rate &&
                            'border border-red-500',
                          onInput: (e) => {
                            const input = e.target as HTMLInputElement
                            if (!input.value) return (input.value = '')
                            if (input.value.startsWith('0')) {
                              input.value = ''
                              return
                            }
                            const value = input.value.replace(/[^\d]/g, '')
                            if (value === '') return (input.value = '')
                            input.value = value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              '.'
                            )
                            field.onChange(input.value)
                          },
                        },
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            />
            <div className="flex flex-col gap-3 mt-3">
              <Button type="submit" variant="contained">
                Submit
              </Button>
              <Button
                type="reset"
                variant="text"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <DataTable fields={columns} items={data ?? []} loading={isPending} />
    </div>
  )
}
