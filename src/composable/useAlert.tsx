'use client'

import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Alert, AlertTitle, Snackbar } from '@mui/material'

type NotifyType = 'success' | 'error' | 'warning' | 'info'

type NotifyOptions = {
  type: NotifyType
  message: string
  duration?: number
  title: string
}

type QueueItem = Required<NotifyOptions> & {
  id: number
}

let queue: QueueItem[] = []
let update: ((queue: QueueItem[]) => void) | null = null
let idCounter = 0
let initialized = false
let rootReady = false

function NotificationQueue() {
  const [items, setItems] = useState<QueueItem[]>([])

  useEffect(() => {
    update = (q) => setItems([...q])
    rootReady = true

    if (queue.length > 0) {
      update(queue)
    }

    return () => {
      update = null
    }
  }, [])

  const handleClose = (id: number) => {
    queue = queue.filter((item) => item.id !== id)
    update?.(queue)
  }

  return (
    <>
      {items.map((item) => (
        <Snackbar
          key={item.id}
          open
          autoHideDuration={item.duration}
          onClose={() => handleClose(item.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(item.id)}
            severity={item.type}
            variant="filled"
            sx={{ width: '100%', opacity: 0.9 }}
          >
            <AlertTitle>{item.title}</AlertTitle>
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

function init() {
  if (!initialized) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    root.render(<NotificationQueue />)
    initialized = true
  }
}

export function notify(options: NotifyOptions) {
  init()

  idCounter++
  const item: QueueItem = {
    id: idCounter,
    type: options.type,
    message: options.message,
    duration: options.duration ?? 1000,
    title: '',
  }

  queue.push(item)

  if (rootReady && update) {
    update(queue)
  }
}
