import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '~shared/ui/sheet'

import { cn } from '~shared/utils'

export const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger nativeButton={false}>
        <Button
          variant="ghost"
          className={cn(
            'flex flex-col items-center justify-start gap-y-0.25 w-full text-[11px] font-regular h-full px-4 text-gray/50',
          )}
        >
          <div className="flex size-5 justify-center">
            <Icons.Hamburger />
          </div>
          Меню
        </Button>
      </SheetTrigger>
      <SheetContent className="w-2/3 left-auto" isFullPageSize>
        <SheetHeader>
          Header
        </SheetHeader>
        content
        <div className="w-full h-full">
          <Flex className="h-full items-end pb-2">
            {/* <a className="flex text-gray-accent items-center gap-x-2 text-md" href="#">
              <Icons.LinkArrow size="sm" />
              Документация
            </a> */}
            <Button asChild className="w-full" variant="error">Выйти из аукциона</Button>
          </Flex>
        </div>
      </SheetContent>
    </Sheet>
  )
}
