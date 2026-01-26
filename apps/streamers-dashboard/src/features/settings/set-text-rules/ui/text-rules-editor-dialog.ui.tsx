import type { Editor } from '@tiptap/react'

import { useState } from 'react'

import { MobileAppDialog } from '~shared/components/app-dialog'
import { WysiwygEditor } from '~shared/components/editor/ui'
import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Title } from '~shared/components/typography'

import { auctionSelectors } from '~entities/auction/store'

import { isAuctionTextRules } from '~shared/api/http/auction-settings'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~shared/ui/dialog'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

import { useUpdateAuctionTextRulesMutation } from '../api/update-text-rules.api'

type AuctionTextRulesWysiwygEditorDialogProps = {
  editor: Editor
}

export const AuctionTextRulesWysiwygEditorDialog = (props: AuctionTextRulesWysiwygEditorDialogProps) => {
  const { editor } = props

  const uuid = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [updateAuctionTextRulesMutation, { isLoading }] = useUpdateAuctionTextRulesMutation()

  const handleOnSave = async () => {
    if (isLoading)
      return

    const editorValue = editor.getHTML()
    const isValidRules = isAuctionTextRules(editorValue)

    if (!isValidRules) {
      return
    }

    try {
      await updateAuctionTextRulesMutation({ auctionUUID: uuid, rules: editorValue })
      setIsDialogOpen(false)
    }
    catch {
      toastErrorNotification('Не удалось сохранить правила аукциона', 'Неизвестная причина', { position: 'top-center' })
    }
  }

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>

      <MediaQueryViewToggler.MatchedItem>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={(
            <Button
              startContent={<Icons.Pencil />}
            >
              Изменить текстовые правила
            </Button>
          )}
          />
          <DialogContent className="w-4/5 landtop:w-3/5 desktop:w-1/2 h-3/4 border-dark-light rounded-[16px] bg-dark-foreground-light px-4 pb-4 flex flex-col">
            <DialogHeader className="pt-2 px-2 h-fit text-left">
              <DialogTitle>
                <Title order={2}>Правила аукциона</Title>
              </DialogTitle>
            </DialogHeader>

            <WysiwygEditor editor={editor} slotsClassNames={{ base: 'overflow-y-scroll' }} />

            <DialogFooter className="">
              <div className="flex w-full gap-x-2 justify-end">
                <Button
                  variant="action"
                  disabled={isLoading}
                  onClick={handleOnSave}
                >
                  Сохранить
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </MediaQueryViewToggler.MatchedItem>

      <MediaQueryViewToggler.NotMatchedItem>
        <MobileAppDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <MobileAppDialog.Trigger render={(
            <Button
              startContent={<Icons.Pencil />}
            >
              Изменить текстовые правила
            </Button>
          )}
          />
          <MobileAppDialog.Content>
            <MobileAppDialog.Header>
              <MobileAppDialog.HeaderTitle value="Правила аукциона" />
            </MobileAppDialog.Header>

            <WysiwygEditor editor={editor} />

            <MobileAppDialog.Footer>
              <div className="flex flex-col w-full gap-y-3">
                <Button
                  variant="action"
                  size="lg"
                  disabled={isLoading}
                  onClick={handleOnSave}
                >
                  Сохранить
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
              </div>
            </MobileAppDialog.Footer>
          </MobileAppDialog.Content>
        </MobileAppDialog>
      </MediaQueryViewToggler.NotMatchedItem>

    </MediaQueryViewToggler>
  )
}
