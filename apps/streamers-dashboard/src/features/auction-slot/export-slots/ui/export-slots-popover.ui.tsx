import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { AuctionPlatform } from '~entities/integrations/model'

import { Text } from '~shared/components/typography'

import { useUnmount } from '~shared/hooks'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Checkbox } from 'klewik-ui/checkbox'
import { Icons } from 'klewik-ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from 'klewik-ui/popover'
import { Select, SelectContent, SelectItem, SelectLabel, SelectList, SelectTrigger } from 'klewik-ui/select'

import { AUCTION_PLATFORM_SLOTS_EXPORT_SERIALIZER } from '../constants/platforms-serializers'
import { useExportSlots } from '../hooks/use-export-slots'

export const ExportSlotsPopover = (props: ButtonProps) => {
  const [platform, setPlatform] = useState<NullablePossible<AuctionPlatform>>(null)
  const [skipDropped, setSkipDropped] = useState(false)

  const { exportFile } = useExportSlots({
    serializer: platform ? AUCTION_PLATFORM_SLOTS_EXPORT_SERIALIZER[platform] : JSON.stringify,
    skipDropped,
  })

  const isExportButtonDisabled = !platform

  return (
    <Popover>
      <PopoverTrigger
        render={(
          <Button
            className="justify-start"
            startContent={<Icons.Export />}
            {...props}
          >
            Экспорт
          </Button>
        )}
      />

      <PopoverContent className="px-3.5 pt-2 pb-3" positionerProps={{ sideOffset: 8, align: 'end' }}>
        <div className="w-full h-full flex flex-col mb-3.5">
          <Text className="text-lg font-semibold text-white mb-3.5" asSpan>Экспорт</Text>

          <div className="mb-3.5">
            <AuctionPlatformSelect onSelect={setPlatform} />
          </div>
          <Checkbox
            checked={skipDropped}
            slotClassnames={{ label: 'text-sm' }}
            labelText="Исключить выбывшие слоты"
            onCheckedChange={setSkipDropped}
          />
        </div>

        <Button
          className="w-full"
          size="sm"
          startContent={<Icons.Export />}
          disabled={isExportButtonDisabled}
          onClick={exportFile}
        >
          Экспортировать
        </Button>

      </PopoverContent>
    </Popover>
  )
}

type DisplayedSelectItemData = {
  value: AuctionPlatform
  label: 'Pointauc' | 'Wheel of names'
  icon?: ReactNode
}

type AuctionPlatformSelectProps = {
  onSelect?: (value: NullablePossible<AuctionPlatform>) => void
}

const auctionPlatformSelectItems: DisplayedSelectItemData[] = [
  { value: 'pointauc', label: 'Pointauc', icon: <Icons.PointaucLogo size="sm" /> },
  { value: 'wheelofnames', label: 'Wheel of names' },
]

function AuctionPlatformSelect(props: AuctionPlatformSelectProps) {
  const { onSelect } = props

  const [value, setValue] = useState<NullablePossible<AuctionPlatform>>(null)

  const handleOnValueChange = (newValue: typeof value) => {
    setValue(newValue)

    if (newValue !== null) {
      onSelect?.(newValue)
    }
  }

  const triggerIcon = useMemo(() => {
    if (!value)
      return undefined

    const target = auctionPlatformSelectItems.find(item => item.value === value)

    return target?.icon
  }, [value])

  useUnmount(() => {
    onSelect?.(null)
  })

  return (
    <Select
      items={auctionPlatformSelectItems}
      value={value}
      size="sm"
      onValueChange={value => handleOnValueChange(value)}
      multiple={false}
    >
      <SelectLabel className="text-sm text-white mb-1">Платформа</SelectLabel>
      <SelectTrigger
        className="w-full text-gray-accent text-left"
        chevronDirection="right-to-left"
        placeholder="Выберите платформу"
        leftIcon={triggerIcon}
        size="sm"
      />
      <SelectContent sideOffset={24} align="start" side="right" alignItemWithTrigger={false}>
        <SelectList>
          {auctionPlatformSelectItems.map(platform => (
            <SelectItem
              className="text-sm text-gray-accent"
              key={platform.value}
              label={platform.label}
              value={platform.value}
              icon={platform.icon}
            />
          ))}
        </SelectList>
      </SelectContent>
    </Select>
  )
}
