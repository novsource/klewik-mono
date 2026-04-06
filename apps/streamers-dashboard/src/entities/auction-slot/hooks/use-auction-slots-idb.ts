import type { AuctionSlot } from '../model'

import { useState } from 'react'

import * as idb from 'idb'

export type AuctionSlotsIDBSchema = {
  slots: {
    value: AuctionSlot
    key: number
  }
}

let auctionSlotsIDB: NullablePossible<idb.IDBPDatabase<AuctionSlotsIDBSchema>> = null
const idbOpened = false

export const useAuctionSlotsIDB = () => {
  const [isOpened, setIsOpened] = useState(idbOpened)

  const open = async () => {
    if (auctionSlotsIDB || isOpened) {
      return auctionSlotsIDB
    }

    try {
      const db = await idb.openDB<AuctionSlotsIDBSchema>('auctionSlots', import.meta.env.VITE_SLOTS_IDB_VERSION, {
        upgrade(db) {
          db.createObjectStore('slots', { keyPath: 'id', autoIncrement: true })
        },
      })

      auctionSlotsIDB = db

      setIsOpened(true)
      return { result: db }
    }
    catch (error) {
      return { error }
    }
  }

  const add = (data: AuctionSlot | AuctionSlot[]) => {
    if (!auctionSlotsIDB)
      return

    const tx = auctionSlotsIDB.transaction('slots', 'readwrite')

    if (Array.isArray(data)) {
      return Promise.all([...data.map(slot => tx.store.add(slot)), tx.done])
    }

    return Promise.all([tx.store.add(data), tx.done])
  }

  const get = (id: number) => {
    return auctionSlotsIDB?.get('slots', id)
  }

  const getAll = () => {
    return auctionSlotsIDB?.getAll('slots')
  }

  const update = async (id: number, data: Partial<Omit<AuctionSlot, 'id'>>) => {
    const targetSlot = await get(id)

    if (!targetSlot) {
      throw new Error('Slot with passed id not found in slots store')
    }

    return auctionSlotsIDB?.put('slots', { ...targetSlot, ...data })
  }

  const put = (data: AuctionSlot | AuctionSlot[]) => {
    if (!auctionSlotsIDB)
      return

    const tx = auctionSlotsIDB.transaction('slots', 'readwrite')

    if (Array.isArray(data)) {
      return Promise.all([...data.map(slot => tx.store.put(slot)), tx.done])
    }

    return Promise.all([tx.store.put(data), tx.done])
  }

  const deleteAll = () => {
    return auctionSlotsIDB?.clear('slots')
  }

  const deleteSlot = (id: number) => {
    return auctionSlotsIDB?.delete('slots', id)
  }

  return { isOpened, open, add, get, getAll, update, put, delete: deleteSlot, deleteAll }
}
