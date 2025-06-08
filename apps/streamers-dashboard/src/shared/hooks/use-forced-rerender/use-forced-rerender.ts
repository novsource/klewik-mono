import { useReducer } from 'react'

const useForcedRerender = () => {
  const rerender = useReducer(() => ({}), {})[1]
  return rerender
}

export { useForcedRerender }
