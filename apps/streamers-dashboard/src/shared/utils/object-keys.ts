type FiltredObject<Obj extends Record<string, unknown>, Keys extends Array<keyof Obj>> = { [P in Keys[number]]: Obj[P] }

export const pickingFromObject = <Obj extends Record<string, unknown>, Keys extends Array<keyof Obj>>
(obj: Obj,
  keysForPicking: Keys,
): FiltredObject<Obj, Keys> => {
  return keysForPicking.reduce((acc, pickKey) => {
    acc[pickKey] = obj[pickKey]
    return acc
  }, {} as FiltredObject<Obj, Keys>)
}

export const objectToDeps = <Obj extends Record<string, unknown>, Keys extends Array<keyof Obj>>
(obj: Obj,
  keysForPicking?: Keys extends undefined ? undefined : Array<keyof Obj>,
): Keys extends undefined ? unknown[] : unknown[] => {
  if (keysForPicking === undefined)
    return Object.values(obj)

  const depsObject = pickingFromObject(obj, keysForPicking)

  return Object.values(depsObject)
}

const test = { hello: 'world', test: 'test2' }

const test2 = objectToDeps(test)
