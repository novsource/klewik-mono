export const chain = <Args>(
  ...callbacks: Array<(...args: Args[]) => void>
): ((...args: Args[]) => void) => {
  return (...args: Args[]): Promise<void> | void => {
    return callbacks.forEach(callback => callback(...args))
  }
}
