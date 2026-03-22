'use client'

import { useState } from 'react'
import { Button } from 'klewik-ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'klewik-ui/dialog'
import { Icons } from 'klewik-ui/icons'

export type AuctionRulesDialogProps = {
  rules: string
}

export const AuctionRulesDialog = (props: AuctionRulesDialogProps) => {
  const { rules } = props

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger render={<Button>Правила</Button>} />
      <DialogContent className="w-1/5 min-w-[400px] h-fit min-h-60 border-dark-light rounded-[24px] bg-dark-foreground-light px-4 pb-4 overflow-clip transition-[height]">
        <DialogHeader className="w-full h-fit flex flex-row justify-between shrink pt-2 items-start">
          <DialogTitle className="text-title-lg font-semibold text-start">
            Просмотр правил аукциона
          </DialogTitle>
          <DialogClose
            className="text-gray-light hover:text-gray-accent cursor-pointer"
            onClick={() => setIsDialogOpen(false)}
          >
            <Icons.LargeCross size="lg" />
          </DialogClose>
        </DialogHeader>
        <div className="auction_rules" dangerouslySetInnerHTML={{ __html: rules }} />
      </DialogContent>
    </Dialog>
  )
}
