import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { FormArrayData, createSlotSchema } from '../model'

const transformCreateSlotsFormData = () => {
  return createSlotSchema.transform<FormArrayData[]>((val) => {
    return val['slots'].map((item) => ({
      ...item,
      points: Number(deleteAllSpacesFromString(item.points)),
    }))
  })
}

export { transformCreateSlotsFormData }
