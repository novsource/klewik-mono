const zodEnum = <T>(arr: T[]): Readonly<[T, ...T[]]> => arr as [T, ...T[]]

export { zodEnum }
