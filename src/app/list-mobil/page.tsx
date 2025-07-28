'use client'

import ArrayMap from '@/components/atoms/ArrayMap'
import { useApi } from '@/composable/useApi'
import { useComputed } from '@/composable/useComputed'
import { Cars } from '@/type/Cars'
import { Button, CircularProgress, debounce, Input } from '@mui/material'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import Empty from '@/assets/empty.png'
import ModalFormPemesanan from '@/components/molecules/ModalFormPemesanan'
import React, { useEffect, useState, useCallback } from 'react'
import { queryClient } from '@/utils/queryClient'
import { useRoute } from '@/composable/useRoute'
import Link from 'next/link'

export default function Page() {
  const [cars_id, setCars_id] = useState('')
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    name: '',
  })
  const [allCars, setAllCars] = useState<Cars[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const route = useRoute()

  const filterParams = useComputed(() => {
    if (!route.origin) return ''
    const url = new URL('/list-mobil', route.origin)
    url.searchParams.append('page', params.page.toString())
    url.searchParams.append('limit', params.limit.toString())
    url.searchParams.append('name', params.name.toString())
    return url.search
  })

  const { data, isLoading } = useApi<Cars[]>({
    url: '/cars' + filterParams.value,
  })

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = params.page + 1

    try {
      setParams((prev) => ({
        ...prev,
        page: nextPage,
      }))

      await queryClient.invalidateQueries({
        queryKey: ['/cars', filterParams.value.slice(1)],
      })
    } catch (error) {
      console.error('Error loading more cars:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [params.page, loadingMore, hasMore, filterParams.value])

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filteredData = data.filter((item) => item.name)

      if (params.page === 1) {
        setAllCars(filteredData)
      } else {
        setAllCars((prev) => {
          const existingIds = new Set(prev.map((car) => car.id))
          const newCars = filteredData.filter((car) => !existingIds.has(car.id))
          return [...prev, ...newCars]
        })
      }

      if (filteredData.length < params.limit) {
        setHasMore(false)
      }
    }
  }, [data, params.page, params.limit])

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100 &&
      !loadingMore &&
      hasMore
    ) {
      loadMore()
    }
  }, [loadingMore, hasMore, loadMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  function handleErrorImage(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    e.currentTarget.src = Empty.src
  }

  return (
    <div className="px-[100px] py-5">
      <ModalFormPemesanan
        setModel={setOpen}
        cars_id={cars_id}
        openModel={open}
        periodeData=""
      />

      <div className="text-4xl font-bold text-center">Rental Mobil</div>
      <div className="grid place-items-center mt-3">
        <Input
          placeholder="Cari Mobil"
          onChange={debounce((e) => {
            setParams((prevState) => {
              return {
                ...prevState,
                name: e.target.value,
              }
            })
          }, 500)}
        />
        <Link href={'/'} className="underline mt-2 text-xs">
          Kembali
        </Link>
      </div>

      {isLoading && params.page === 1 && (
        <div className="flex justify-center items-center mt-10">
          <CircularProgress />
        </div>
      )}

      <div className="mt-20 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-rows-1 gap-5 place-items-center">
        <ArrayMap
          of={allCars}
          render={(item, index) => (
            <div
              key={item.id || index + 'cars'}
              className="border border-slate-300 w-[300px] p-5 rounded-lg"
            >
              <div className="text-center text-2xl font-bold text-ellipsis line-clamp-1">
                {item.name || 'Mobil'}
              </div>
              <div>
                {item.image &&
                String(item.image).includes('http') &&
                typeof item.image === 'string' &&
                item.image !== 'Invalid faker method - datatype.string' ? (
                  <Image
                    src={item.image ?? ''}
                    alt="logo"
                    className="w-full h-[100px] rounded-lg mt-5"
                    loading="lazy"
                    width={100}
                    height={100}
                    objectFit="cover"
                    unoptimized
                    onError={handleErrorImage}
                  />
                ) : (
                  <div className="border border-slate-400 bg-slate-300 rounded-lg w-full h-[100px] flex justify-center items-center mt-5">
                    <ImageOff />
                  </div>
                )}
              </div>
              <div className="mt-5">
                <div>
                  Harian :{' '}
                  <span className="font-bold">
                    Rp.
                    {(item.day_rate &&
                      Number(item.day_rate).toLocaleString('id-ID')) ||
                      '0'}
                  </span>
                </div>
                <div>
                  Bulanan :{' '}
                  <span className="font-bold">
                    Rp.
                    {(item.month_rate &&
                      Number(item.month_rate).toLocaleString('id-ID')) ||
                      '0'}
                  </span>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="w-full flex items-center justify-center !text-white !mt-5"
                size="small"
                onClick={() => {
                  setCars_id(String(item.id))
                  setOpen(true)
                }}
              >
                Book now
              </Button>
            </div>
          )}
        />
      </div>

      {hasMore && allCars.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button
            variant="contained"
            onClick={loadMore}
            disabled={loadingMore}
            className="!px-8 !py-3"
            startIcon={loadingMore ? <CircularProgress size={20} /> : null}
          >
            {loadingMore ? 'Loading...' : 'Load More Cars'}
          </Button>
        </div>
      )}

      {!hasMore && allCars.length > 0 && (
        <div className="text-center mt-10 text-gray-500">
          <p>Semua mobil telah ditampilkan</p>
        </div>
      )}

      {!isLoading && allCars.length === 0 && (
        <div className="text-center mt-20">
          <Image
            src={Empty}
            alt="No cars available"
            width={200}
            height={200}
            className="mx-auto opacity-50"
          />
          <p className="text-gray-500 mt-5">Tidak ada mobil tersedia</p>
        </div>
      )}
    </div>
  )
}
