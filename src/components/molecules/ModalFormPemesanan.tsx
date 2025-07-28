import { notify } from '@/composable/useAlert'
import { useApi } from '@/composable/useApi'
import { useComputed } from '@/composable/useComputed'
import { Cars } from '@/type/Cars'
import { Orders } from '@/type/Orders'
import { Box, Button, MenuItem, Modal, Select, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { differenceInDays, differenceInMonths, format } from 'date-fns'
import { X } from 'lucide-react'
import React from 'react'

export default function ModalFormPemesanan({
  openModel,
  cars_id,
  periodeData,
  setModel,
}: Readonly<{
  openModel: boolean
  cars_id: string
  periodeData: string
  setModel: React.Dispatch<boolean>
}>) {
  const [payload, setPayload] = React.useState<{
    order_date: Date | undefined
    pickup_date: Date | undefined
    dropoff_date: Date | undefined
    pickup_location: string
    dropoff_location: string
    day_rate: string
    month_rate: string
    car_id: string | null
  }>({
    order_date: new Date(),
    pickup_date: undefined,
    dropoff_date: undefined,
    pickup_location: '',
    dropoff_location: '',
    day_rate: '',
    month_rate: '',
    car_id: cars_id,
  })
  const [open, setOpen] = React.useState(false)
  const [periode, setPeriode] = React.useState(periodeData)

  const { data } = useApi<Cars[]>({
    url: '/cars',
  })

  const getData = useComputed(() => data?.filter((item) => item.name))
  const intervalDate = useComputed(() => {
    if (periode === 'month') return 0

    const startDate = new Date(payload.pickup_date ?? new Date())
    const endDate = new Date(payload.dropoff_date ?? new Date())
    const result = differenceInDays(endDate, startDate)
    return result === 0 ? 1 : result
  })
  const intervalMonth = useComputed(() => {
    if (periode === 'day') return 0
    const startDate = new Date(payload.pickup_date ?? new Date())
    const endDate = new Date(payload.dropoff_date ?? new Date())
    const result = differenceInMonths(endDate, startDate)
    return result === 0 ? 1 : result
  })

  const { mutate, isPending } = useApi<Orders, Orders>({
    url: '/orders',
    method: 'POST',
    body: {
      car_id: payload.car_id ?? '',
      order_date: payload.order_date ? format(new Date(), 'yyyy-MM-dd') : '',
      pickup_date: payload.pickup_date ? format(new Date(), 'yyyy-MM-dd') : '',
      dropoff_date: payload.dropoff_date
        ? format(new Date(), 'yyyy-MM-dd')
        : '',
      pickup_location: payload.pickup_location,
      dropoff_location: payload.dropoff_location,
    },
    onSuccess: () => {
      notify({
        title: 'Sukses',
        message: 'Pesananmu berhasil dibuat',
        type: 'success',
      })
      setModel(false)
      setOpen(false)
    },
  })
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({
      car_id: payload.car_id ?? '',
      order_date: payload.order_date
        ? format(new Date(payload.order_date), 'yyyy-MM-dd')
        : '',
      pickup_date: payload.pickup_date
        ? format(new Date(payload.pickup_date), 'yyyy-MM-dd')
        : '',
      dropoff_date: payload.dropoff_date
        ? format(new Date(payload.dropoff_date), 'yyyy-MM-dd')
        : '',
      pickup_location: payload.pickup_location,
      dropoff_location: payload.dropoff_location,
    })
  }

  React.useEffect(() => {
    if (openModel) {
      setOpen(true)
    } else {
      setModel(false)
      setOpen(false)
    }
  }, [openModel])

  React.useEffect(() => {
    setPayload({
      ...payload,
      car_id: cars_id,
    })
  }, [cars_id])

  React.useEffect(() => {
    setPeriode(periodeData)
  }, [periodeData])

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
        setModel(false)
      }}
      title="Form Pemesanan"
    >
      <div>
        <Box
          sx={{
            minWidth: 400,
            backgroundColor: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="p-3 border-b border-slate-300 flex justify-between items-center">
            <div>Form Pemesanan</div>
            <Button
              variant="outlined"
              color="inherit"
              className="!border-none"
              size="small"
              onClick={() => {
                setModel(false)
                setOpen(false)
              }}
            >
              <X />
            </Button>
          </div>
          <div className="p-5 rounded overflow-auto h-[700px]">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mt-3">
                <label htmlFor="cars">Mobil</label>
                <div>
                  <Select
                    labelId="SelectCar"
                    id="Select"
                    value={payload.car_id || ''}
                    label="Cars"
                    color="primary"
                    className="w-48 "
                    sx={{
                      backgroundColor: 'white',
                      '&:focus': {
                        backgroundColor: 'tranparent',
                      },
                    }}
                    size="small"
                    onChange={(e) => {
                      setPayload((prev) => ({
                        ...prev,
                        car_id: e.target.value,
                      }))
                    }}
                    disabled
                  >
                    {(getData.value || [])?.map((item: Cars) => (
                      <MenuItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="rate">Periode</label>
                <div className="flex items-center gap-5">
                  <Select
                    labelId="Periode"
                    id="Select"
                    value={periode || ''}
                    label="Periode"
                    color="primary"
                    className="w-48 "
                    sx={{
                      backgroundColor: 'white',
                      '&:focus': {
                        backgroundColor: 'tranparent',
                      },
                    }}
                    size="small"
                    onChange={(e) => {
                      setPeriode(e.target.value)
                    }}
                  >
                    <MenuItem value={'harian'}>Harian</MenuItem>
                    <MenuItem value={'bulanan'}>Bulanan</MenuItem>
                  </Select>
                </div>
                <div className="mt-3">
                  <label htmlFor="name">Pickup</label>
                  <div>
                    <div className="flex items-center gap-5">
                      <TextField
                        onChange={(e) =>
                          setPayload({
                            ...payload,
                            pickup_location: e.target.value,
                          })
                        }
                        size="small"
                      />
                      {(periode === 'harian' && (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Pilih tanggal"
                            minDate={new Date()}
                            slotProps={{ textField: { size: 'small' } }}
                            name="startDate"
                            onChange={(newValue) =>
                              setPayload({
                                ...payload,
                                pickup_date: newValue ?? undefined,
                              })
                            }
                          />
                        </LocalizationProvider>
                      )) || (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label={'Bulanan'}
                            views={['month', 'year']}
                            minDate={new Date()}
                            slotProps={{ textField: { size: 'small' } }}
                            name="startDate"
                            onChange={(newValue) =>
                              setPayload({
                                ...payload,
                                pickup_date: newValue ?? undefined,
                              })
                            }
                          />
                        </LocalizationProvider>
                      )}
                    </div>
                    <iframe
                      width="425"
                      height="150"
                      title="maps"
                      className="mt-3"
                      src={`https://maps.google.com/maps?q=${payload.pickup_location}&amp;ie=UTF8&amp;&output=embed`}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label htmlFor="name">Drop Off</label>
                  <div>
                    <div className="flex items-center gap-5">
                      <TextField
                        onChange={(e) =>
                          setPayload({
                            ...payload,
                            dropoff_location: e.target.value,
                          })
                        }
                        size="small"
                      />
                      {(periode === 'harian' && (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Pilih Tanggal"
                            minDate={payload.pickup_date ?? new Date()}
                            slotProps={{ textField: { size: 'small' } }}
                            name="dropoff_date"
                            onChange={(newValue) =>
                              setPayload({
                                ...payload,
                                dropoff_date: newValue ?? undefined,
                              })
                            }
                          />
                        </LocalizationProvider>
                      )) || (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label={'Bulanan'}
                            views={['month', 'year']}
                            minDate={new Date()}
                            slotProps={{ textField: { size: 'small' } }}
                            name="startDate"
                            onChange={(newValue) =>
                              setPayload({
                                ...payload,
                                dropoff_date: newValue ?? undefined,
                              })
                            }
                          />
                        </LocalizationProvider>
                      )}
                    </div>
                    <iframe
                      width="425"
                      height="150"
                      title="maps"
                      className="mt-3"
                      src={`https://maps.google.com/maps?q=${payload.dropoff_location}&amp;ie=UTF8&amp;&output=embed`}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold mt-5">
                    Total Harga:{' '}
                    {periode === 'harian' && intervalDate.value !== 0 && (
                      <span>
                        Rp.
                        {Number(
                          Number(
                            (getData.value || []).find(
                              (item) =>
                                Number(item.id) === Number(payload.car_id)
                            )?.day_rate ?? 0
                          ) * intervalDate.value
                        ).toLocaleString('id-ID')}
                      </span>
                    )}
                    {periode === 'bulanan' && intervalMonth.value !== 0 && (
                      <span>
                        Rp.
                        {Number(
                          Number(
                            (getData.value || []).find(
                              (item) =>
                                Number(item.id) === Number(payload.car_id)
                            )?.month_rate ?? 0
                          ) * intervalMonth.value
                        ).toLocaleString('id-ID')}{' '}
                      </span>
                    )}
                    {!periode && <span>Rp.0</span>}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  className="w-full flex justify-center !text-white"
                  disabled={
                    isPending ||
                    intervalMonth.value < 1 ||
                    Number(intervalDate) < 1
                  }
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  className="w-full flex justify-center hover:bg-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </div>
    </Modal>
  )
}
