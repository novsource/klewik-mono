export const chain = <Args extends unknown>(
  fnOne: (...args: Args[]) => unknown,
  fnTwo: (...args: Args[]) => unknown
) => {
  const fnArr = [fnOne, fnTwo]
  return (...args: Args[]) => {
    return fnArr.forEach((callback) => callback(...args))
  }
}
