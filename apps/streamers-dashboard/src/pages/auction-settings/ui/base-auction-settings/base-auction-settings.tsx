import { ChangeEvent, memo, useRef, useState } from 'react'

import { useDeleteAuctionMutation } from '~pages/auction-settings/api/base-auction-settings'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~shared/ui/dialog'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { TabsContent } from '~shared/ui/tabs'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { SettingsArea, SettingsAreasDivider } from '../auction-settings-area'

const BaseAuctionSettingsContent = () => {
  return (
    <TabsContent className="w-full h-full" value="base">
      <Flex className="w-full gap-y-12" direction="column">
        <DeleteAuctionSettingsArea />
        <SettingsAreasDivider />
      </Flex>
    </TabsContent>
  )
}
const DeleteAuctionSettingsArea = memo(() => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isInputEmpty, setIsInputEmpty] = useState(true)
  const [deleteAuctionMutation, { isLoading }] = useDeleteAuctionMutation()

  const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const clearInputValue = deleteAllSpacesFromString(e.target.value)

    if (clearInputValue.length !== 0) {
      setIsInputEmpty(false)
    } else {
      setIsInputEmpty(true)
    }
  }

  const deleteAuction = async () => {
    const request = deleteAuctionMutation({ auctionId })

    toastPromiseNotification(request, 'Удаляем аукцион...', {
      successText: 'Аукцион успешно удален!',
      errorText: 'Не удалось удалить аукцион',
    })
  }

  return (
    <SettingsArea
      title="Удаление аукциона"
      description="Отправьте аукцион в небытие"
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-red/10 text-red/80 transition-all hover:bg-red/20 hover:text-red"
            startContent={<Icons.Bin size="xs" />}
          >
            Удалить аукцион
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => {
            if (!isInputEmpty) e.preventDefault()
          }}
          slotsClassNames={{
            close: 'cursor-pointer',
            overlay: 'backdrop-blur-[2px] bg-dark-foreground/20',
            content:
              'w-full max-w-[500px] border-1 border-dark-accent rounded-[12px]',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-start">
              Вы точно уверены что хотите удалить аукцион?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <Flex className="gap-y-2" direction="column">
            <Typography tag="p">
              Для подтверждения введите пароль от аукциона
            </Typography>
            <Input
              ref={inputRef}
              type="password"
              placeholder="Введите пароль"
              startContent={<Icons.Key className="text-gray-accent" />}
              onChange={handleInputOnChange}
            />
          </Flex>
          <DialogFooter className="flex flex-row">
            <Button
              className="w-full bg-red/10 text-red/80 transition-all hover:bg-red/20 hover:text-red"
              startContent={<Icons.Bin size="xs" />}
              onClick={deleteAuction}
              disabled={isInputEmpty}
            >
              {!isLoading ? 'Удалить аукцион' : 'Удаляем аукцион...'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsArea>
  )
})

export { BaseAuctionSettingsContent }
