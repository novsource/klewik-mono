import type { MutableRefObject } from 'react'
import { useRef } from 'react'

export const useMutableElementRef = <T extends HTMLElement>(initialValue?: any) => {
  const elementRef = useRef<T>(initialValue)

  return elementRef as MutableRefObject<T>
}
