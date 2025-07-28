'use client'

import { useApi } from '@/composable/useApi'
import { useComputed } from '@/composable/useComputed'
import { Cars } from '@/type/Cars'
import { Button, MenuItem, Select } from '@mui/material'
import { CarFront, CircleDollarSign, Key, Scale } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ModalFormPemesanan from '@/components/molecules/ModalFormPemesanan'

export default function Home() {
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
    car_id: null,
  })
  const [open, setOpen] = React.useState(false)
  const [periode, setPeriode] = React.useState('')

  const { data } = useApi<Cars[]>({
    url: '/cars',
  })

  const getData = useComputed(() => data?.filter((item) => item.name))

  return (
    <div>
      <ModalFormPemesanan
        setModel={setOpen}
        openModel={open}
        cars_id={payload.car_id ?? ''}
        periodeData={periode}
      />
      <nav className="px-[100px] h-[60px] flex justify-center items-center border-b border-slate-100 shadow font-bold text-2xl">
        Rental Mobil
      </nav>
      <section className="relative">
        <div className="absolute top-16 left-5 z-40 transform  text-white text-6xl font-bold">
          <div>Rental Mobil Murah Meriah</div>
          <div className="text-orange-300 flex items-center gap-3">
            Booking sekarang!
          </div>
        </div>
        <div className="bg-black opacity-30 absolute top-0 left-0 w-full h-full rounded-bl-4xl rounded-br-4xl" />
        <div className="h-[400px] bg-gray-300 bg-[url('/avanza.jpeg')] bg-cover bg-center bg-no-repeat rounded-bl-4xl rounded-br-4xl" />
        <div className="absolute -bottom-10 shadow-2xl min-w-[400px]  px-14 py-5 left-1/2 transform -translate-x-1/2 bg-primary rounded-2xl h-[100px] z-10">
          <div className="flex items-center gap-5 mb-2">
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
                  setPayload((prev) => ({ ...prev, car_id: e.target.value }))
                }}
              >
                {(getData.value || [])?.map((item: Cars) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <Select
                labelId="SelectCar"
                id="Select"
                value={periode || ''}
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
                  setPeriode(e.target.value)
                }}
              >
                <MenuItem value={'harian'}>Harian</MenuItem>
                <MenuItem value={'bulanan'}>Bulanan</MenuItem>
              </Select>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                className="!bg-orange-700 !text-white"
                onClick={() => setOpen(true)}
              >
                Book Now
              </Button>
            </div>
          </div>
          <Link href="/list-mobil" className="text-white underline text-sm ">
            Lihat semua mobil
          </Link>
        </div>
      </section>
      <section className="px-[100px] py-20">
        <div className="text-4xl mb-14 font-bold text-center">
          Kenapa Harus Pilih Kami
        </div>
        <div className="grid grid-cols-4 grid-rows-1 gap-5">
          <div className="border border-slate-300 w-[300px] p-5 rounded-lg">
            <div className="text-center text-2xl font-bold">
              Mobil tahun 2020+
            </div>
            <div className="grid place-items-center my-5">
              <CarFront className="w-20 h-20 text-primary" />
            </div>
            <p>
              Mobil dengan tahun 2020 keatas mesin bagus cocok untuk perjalanan
              jauh
            </p>
          </div>
          <div className="border border-slate-300 w-[300px] p-5 rounded-lg">
            <div className="text-center text-2xl font-bold">
              Bisa lepas kunci
            </div>
            <div className="grid place-items-center my-5">
              <Key className="w-20 h-20  text-primary" />
            </div>
            <p>
              Kami menyediakan lepas kunci untuk memudahkan anda mengendarai
              sendiri
            </p>
          </div>
          <div className="border border-slate-300 w-[300px] p-5 rounded-lg">
            <div className="text-center text-2xl font-bold">
              Harga lebih murah
            </div>
            <div className="grid place-items-center my-5">
              <CircleDollarSign className="w-20 h-20  text-primary" />
            </div>
            <p>Harga sangat terjangkau untuk mobil di tahun 2020 keatas</p>
          </div>
          <div className="border border-slate-300 w-[300px] p-5 rounded-lg">
            <div className="text-center text-2xl font-bold">
              Sewa bisa per-bulan
            </div>
            <div className="grid place-items-center my-5">
              <Scale className="w-20 h-20  text-primary" />
            </div>
            <p>Sewa mobil disini bisa per-bulan agar menghemat biaya</p>
          </div>
        </div>
      </section>
      <section>
        <div className="text-4xl font-bold text-center bg-green-600 min-h-[400px] px-[100px] py-[30px] text-white">
          <div> Pesan Offline</div>
          <div className="mt-10">
            <div className="grid grid-rows-1 grid-cols-2">
              <div>
                <iframe
                  className="rounded-lg"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.6260156509097!2d110.51510937584668!3d-7.723213376531219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5b8cc011fde1%3A0x467463ee5c3025d1!2sMS%20H12!5e0!3m2!1sid!2sid!4v1753596370264!5m2!1sid!2sid"
                  width="600"
                  height="450"
                  loading="lazy"
                  title="Maps"
                ></iframe>
              </div>
              <p className="text-2xl text-left">
                Perumahan Griya Pratama Asri 2 No.H-12, Somoragen, Joho, Kec.
                Prambanan, Kabupaten Klaten, Jawa Tengah 57454
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
