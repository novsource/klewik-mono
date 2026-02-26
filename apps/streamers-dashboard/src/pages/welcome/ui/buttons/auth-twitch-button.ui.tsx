import { useAuthTwitch } from '~pages/welcome/hooks/use-auth-twitch'

import { Modal, ModalContent } from '~shared/components/modal'
import { Text } from '~shared/components/typography'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

type AuthTwitchButtonProps = {
  onSuccess?: () => void
  onError?: () => void
}

export const AuthTwitchButton = (props: AuthTwitchButtonProps) => {
  const { onSuccess, onError } = props

  const authTwitch = useAuthTwitch({ onSuccess, onError })

  const isLoadingModalOpened = authTwitch.state.isLoading

  return (
    <>
      <Button
        startContent={<Icons.TwitchLogo />}
        loading={authTwitch.state.isLoading}
        disabled={authTwitch.state.isLoading}
        onClick={authTwitch.actions.openTwitchAuthWindow}
      >
        Продолжить с Twitch
      </Button>

      <Modal open={isLoadingModalOpened} disablePointerDismissal={true}>
        <ModalContent variant="clear" className="flex justify-center items-center gap-y-4 size-fit p-20 container">
          <Icons.Loading width={42} height={42} />
          <Text className="text-gray-accent">Ожидаем подключение к Twitch...</Text>
        </ModalContent>
      </Modal>
    </>
  )
}
