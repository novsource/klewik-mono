import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

/**
  @todo Refactor dialog icon
*/
const ProcessDonationDialogIcon = () => {
  return (
    <div className="w-fit h-fit bg-gradient-to-r from-[#50C9C3]/30 to-[#96DEDA]/30 p-0.5 rounded-small outline-2 outline-[#50C9C3]/10">
      <Flex
        className="relative p-1.25 border-[0.5px] border-[#50C9C3]/30 rounded-small w-10 h-10"
        align="center"
        justify="center"
      >
        <Icons.MoneyHand className="pt-0.5" width="32" height="32" gradient />
      </Flex>
    </div>
  )
}

export { ProcessDonationDialogIcon }
