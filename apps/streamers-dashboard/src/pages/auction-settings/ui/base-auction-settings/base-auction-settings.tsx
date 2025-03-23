import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { TabsContent } from '~shared/ui/tabs'

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
const DeleteAuctionSettingsArea = () => {
  return (
    <SettingsArea
      title="Удаление аукциона"
      description="Отправьте аукцион в небытие"
    >
      <Button
        className="bg-red/10 text-red/80 transition-all hover:bg-red/20 hover:text-red"
        startContent={<Icons.Bin size="xs" />}
      >
        Удалить аукцион
      </Button>
    </SettingsArea>
  )
}

export { BaseAuctionSettingsContent }
