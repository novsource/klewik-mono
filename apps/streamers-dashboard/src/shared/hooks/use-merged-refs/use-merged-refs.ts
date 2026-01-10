import { useCallback } from 'react'
import type { LegacyRef, MutableRefObject, Ref } from 'react'

import { isFunction } from '~shared/utils'

export type MaybeRef<T> = Ref<T> | LegacyRef<T> | undefined

export const useMergedRefs = <T>(...refs: Array<MaybeRef<T>>) => {
  return useCallback((instance: NullablePossible<T>) => {
    for (const ref of refs) {
      updateRef(ref, instance)
    }
  }, [refs])
}

function updateRef<T>(ref: MaybeRef<T>, instance: NullablePossible<T>) {
  if (!ref)
    return

  if (isFunction(ref)) {
    ref(instance)
  }
  else {
    (ref as MutableRefObject<NullablePossible<T>>).current = instance
  }
}
