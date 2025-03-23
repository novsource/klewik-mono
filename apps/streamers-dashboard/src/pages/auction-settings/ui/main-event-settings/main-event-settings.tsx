import { Flex } from '~shared/ui/flex'
import { TabsContent } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

const MainEventSettingsContent = () => {
  return (
    <TabsContent className="w-full h-full" value="event">
      <Flex className="h-fit w-full gap-y-3" direction="column">
        <Typography tag="h3">Вид события</Typography>
        <Flex className="w-full gap-x-2" align="center"></Flex>
      </Flex>
    </TabsContent>
  )
}

export { MainEventSettingsContent }
