import { useCallback } from 'react'
import type { MutableRefObject, Ref } from 'react'

import { isFunction } from '~shared/utils'

export const useMergedRefs = <T>(...refs: Array<NullablePossible<Ref<T>>>) => {
  return useCallback((instance: NullablePossible<T>) => {
    for (const ref of refs) {
      updateRef(ref, instance)
    }
  }, [refs])
}

function updateRef<T>(ref: Ref<T>, instance: NullablePossible<T>) {
  if (!ref)
    return

  if (isFunction(ref)) {
    ref(instance)
  }
  else {
    const castedMutableRef = ref as MutableRefObject<NullablePossible<T>>

    castedMutableRef.current = instance
  }
}
