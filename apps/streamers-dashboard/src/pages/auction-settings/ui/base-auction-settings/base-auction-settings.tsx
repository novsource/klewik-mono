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
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={'error'}
            startContent={<Icons.Bin width={14} height={14} />}
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
            overlay: 'backdrop-blur-[1px] bg-black/80',
            content:
              'w-full max-w-[500px] border-0 rounded-[16px] bg-dark-foreground',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-start">
              <Flex className="gap-y-4" direction="column">
                <Flex
                  className="border-1 border-red/30 rounded-medium w-fit"
                  align="center"
                  justify="center"
                >
                  <Flex
                    className="bg-red/10 h-full w-full p-2.5 rounded-medium"
                    align="center"
                    justify="center"
                  >
                    <Icons.Bin className="text-red" />
                  </Flex>
                </Flex>
                <Flex className="gap-y-1.5" direction="column" align="start">
                  <Typography tag="h3">Удаление аукциона</Typography>
                  <Typography className="text-gray-accent font-normal" tag="p">
                    С глаз долой и из сердца вон
                  </Typography>
                </Flex>
              </Flex>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <Flex className="gap-y-2" direction="column">
            <Typography className="font-medium" tag="p">
              Для подтверждения введите свой мастер-ключ:
            </Typography>
            <Input
              ref={inputRef}
              type="password"
              placeholder="Введите мастер-ключ"
              startContent={<Icons.Key className="text-gray-accent" />}
              onChange={handleInputOnChange}
            />
          </Flex>
          <DialogFooter className="flex flex-row gap-x-2 justify-end pt-2">
            <Button
              variant={'error'}
              onClick={deleteAuction}
              disabled={isInputEmpty}
            >
              {!isLoading ? 'Удалить аукцион' : 'Удаляем аукцион...'}
            </Button>
            <Button
              variant={'outline'}
              className="border-1 border-dark-accent hover:border-gray font-medium"
              onClick={() => setIsDialogOpen(false)}
            >
              Вернуться
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsArea>
  )
})

export { BaseAuctionSettingsContent }
