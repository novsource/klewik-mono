import type { PopoverRootProps } from '@base-ui/react'

import { useRef, useState } from 'react'

import { globalDialogsActions } from '~app/components/global-dialogs/store/global-dialogs.slice'

import { useUpdateBetsStatusMutation } from '~entities/auction/api'
import { auctionSelectors } from '~entities/auction/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import type { CommandItemProps } from '~shared/ui/command'
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from '~shared/ui/command'
import { Icons } from '~shared/ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from '~shared/ui/popover'

import { cn, mergeProps } from '~shared/utils'

export type DashboardHeaderMenuProps = PopoverRootProps & {
  isTimerVisible?: boolean
  onTimerVisibilityChanges?: () => void
}

export const DashboardHeaderMenu = (props: DashboardHeaderMenuProps) => {
  const { onTimerVisibilityChanges, isTimerVisible, ...restProps } = props

  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const onSelectHandler = () => {
    onTimerVisibilityChanges && onTimerVisibilityChanges()
  }

  return (
    <Popover onOpenChange={setIsMenuOpened} {...restProps}>
      <PopoverTrigger asChild>
        <Button
          className="size-8.5"
          isIconOnly
          icon={isMenuOpened ? <Icons.Close /> : <Icons.Hamburger size="sm" />}
          size="xs"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-2 border-dark-light rounded-medium"
        sideOffset={12}
        align="end"
      >
        <Command>
          <CommandList>
            <CommandGroup className="overflow-clip">
              <TimerCommandItem
                isTimerVisible={isTimerVisible}
                onSelect={onSelectHandler}
              />
              <BetsControlCommandItem />
              <CommandSeparator className="bg-dark-accent my-2" />
              <OpenSettingsDialogCommandItem />
              <CommandItem
                className="cursor-pointer text-red/80 bg-red/5 data-[selected=true]:bg-red/15 data-[selected=true]:text-red"
                {...restProps}
              >
                <Icons.Login className="rotate-x-0" size="xs" />
                Выйти из аукциона
              </CommandItem>
              <CommandSeparator className="bg-dark-accent my-2" />
              <CommandItem
                className="cursor-pointer data-[selected=true]:bg-dark-light"
                {...restProps}
              >
                <Icons.LinkArrow size="xs" />
                Документация
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function OpenSettingsDialogCommandItem() {
  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const openSettingsDialog = () => {
    setDialogOpenStatus({ dialog: 'settings', status: true })
  }

  return (
    <CommandItem className="cursor-pointer" onSelect={openSettingsDialog}>
      <Icons.Settings size="xs" />
      Настройки
    </CommandItem>
  )
}

type TimerCommandItemProps = CommandItemProps & {
  isTimerVisible?: boolean
}

function TimerCommandItem(props: TimerCommandItemProps) {
  const { className, isTimerVisible = false, ...restProps } = props

  return (
    <CommandItem
      className="cursor-pointer data-[selected=true]:bg-dark-light"
      {...restProps}
    >
      <Icons.Timer size="xs" />
      {isTimerVisible ? 'Отключить и скрыть таймер' : 'Отобразить таймер'}
    </CommandItem>
  )
}

type BetsControlCommandItemProps = CommandItemProps

function BetsControlCommandItem(props: BetsControlCommandItemProps) {
  const { className, ...restProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const isBetsClosed = useStoreSelector(auctionSelectors.getIsBetsClosed)

  const [updateStatusMutation, { isLoading }] = useUpdateBetsStatusMutation()
  const isLoadingRef = useRef(false)

  const onSelectHandler = async () => {
    try {
      if (isLoadingRef.current)
        return

      isLoadingRef.current = true
      await updateStatusMutation({ auctionUUID, status: !isBetsClosed })
      isLoadingRef.current = false
    }
    catch {
      isLoadingRef.current = false
    }
  }

  const commandItemProps = mergeProps(restProps, { onSelect: onSelectHandler })

  return (
    <CommandItem
      className={cn([
        'cursor-pointer',
        !isBetsClosed && 'data-[selected=true]:bg-red/5 data-[selected=true]:text-red',
        isLoading && 'data-[selected=true]:bg-transparent',
      ], className)}
      disabled={isLoading}
      {...commandItemProps}
    >
      {isLoading && <Icons.Loading size="sm" />}
      {!isLoading && isBetsClosed && <Icons.OpenBets size="xs" />}
      {!isLoading && !isBetsClosed && <Icons.LargeCross />}
      {isBetsClosed ? 'Открыть ставки' : 'Закрыть ставки'}
    </CommandItem>
  )
}
