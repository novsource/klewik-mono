export const getRandomNumberInRange = (from: number, to: number) => {
  return Math.random() * (to - from) + from
}
