type SplitObjectResult<T extends Record<any, any>, SplitKeys extends Array<keyof T>> = [Pick<T, SplitKeys[number]>, Omit<T, SplitKeys[number]>]

export const splitObject = <T extends Record<any, any>, Keys extends Array<keyof T>>(target: T, keys: Keys): SplitObjectResult<T, Keys> => {
  const passedObjectKeys = Object.keys(target) as Array<keyof typeof target>

  const splitObjectCollection = new Set(keys)

  const restTargetObjectData = {} as Omit<T, Keys[number]>

  const splittedObject = passedObjectKeys.reduce<Pick<T, Keys[number]>>((result, key) => {
    const isShouldBeInSplittedObject = splitObjectCollection.has(key)

    if (isShouldBeInSplittedObject) {
      result[key] = target[key]
    }
    else {
      const castedKey = key as keyof Omit<T, Keys[number]>

      restTargetObjectData[castedKey]! = target[key]
    }

    return result
  }, {} as Pick<T, Keys[number]>)

  return [splittedObject, restTargetObjectData]
}
