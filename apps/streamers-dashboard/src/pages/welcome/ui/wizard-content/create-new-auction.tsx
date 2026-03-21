import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import type { CreateAuctionQueryReturnValue } from '~pages/welcome/api/create-auction.api'
import { useCreateAuctionMutation } from '~pages/welcome/api/create-auction.api'
import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import type { Auction } from '~entities/auction/model'

import { loginInAuction } from '~shared/api/http/auth'
import { getAuthUser, getUserAuctions } from '~shared/api/http/users/users.api'

import { Text, Title } from '~shared/components/typography'

import { useAsync } from '~shared/hooks'

import { Button } from 'klewik-ui/button'
import { Card, CardContent, CardHeader } from 'klewik-ui/card'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { toastErrorNotification } from 'klewik-ui/toaster/lib'
import type { WizardItemProps } from 'klewik-ui/wizard'
import { useWizardContext, WizardItem, WizardTrigger } from 'klewik-ui/wizard'

import { cn } from '~shared/utils'

export const WizardCreateNewAuctionItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const navigate = useNavigate()

  const { back } = useWizardContext()

  const goToExistingAuction = async (auctionUUID: string) => {
    const response = await loginInAuction(auctionUUID)

    if (response.status !== 200) {
      toastErrorNotification('Не удалось авторизоваться в аукционе')
    }
    else {
      navigate(`/dashboard/${auctionUUID}/wheel`)
    }
  }

  const getUserAuctions = useGetUserAuctions({
    onError: () => {
      back()
      toastErrorNotification('Не удалось загрузить данные пользователя')
    },
  })

  const {
    state: { mutationState: createAuctionMutationState },
    actions: { createAuction },
  } = useCreateNewAuction({
    onSuccess: (params) => {
      goToExistingAuction(params.auctionUUID)
    },
    onError: () => {
      toastErrorNotification('Не удалось создать аукцион')
    },
  })

  if (
    (createAuctionMutationState.isLoading || getUserAuctions.state.queryState.isLoading)
    && !getUserAuctions.state.activeAuction
    && !getUserAuctions.state.queryState.isError
  ) {
    return (
      <WizardItem
        value={WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION}
        className={cn('flex flex-col gap-y-6 items-center justify-center')}
        {...restProps}
      >
        <Icons.Loading width={48} height={48} />
      </WizardItem>
    )
  }

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION}
      className={cn('flex flex-col gap-y-6')}
      {...restProps}
    >
      <WizardTrigger type="reset">
        <Button startContent={<Icons.Undo size="xs" />} size="xs">Назад</Button>
      </WizardTrigger>

      <Flex className="gap-y-2" direction="column">
        <Title order={1}>Обнаружен активный аукцион</Title>
        <Text className="text-gray">
          На данный момент у вас уже есть созданный аукцион.
          Возможно создание только одного активного аукциона.
          Вы можете перейти в аукцион или создать новый (при этом текущий активный аукцион автоматически закроется)
        </Text>
      </Flex>

      <Card
        className="flex justify-between items-center gap-x-2 cursor-pointer outline-1 outline-dark-light hover:outline-gray/70 pt-2"
        onClick={() => goToExistingAuction(getUserAuctions.state.activeAuction!.auctionUUID)}
      >
        <div className="flex flex-col">
          <CardHeader className="flex flex-col gap-y-2 tablet:gap-y-3">
            <Text className="text-gray-light" asSpan>Перейти в</Text>
            <Text className="text-base leading-5 tablet:text-title font-semibold">
              {getUserAuctions.state.activeAuction?.auctionUUID}
            </Text>
          </CardHeader>
          <CardContent>
            <Text className="text-sm tablet:text-md text-gray-accent">
              {`Создан: ${new Date(getUserAuctions.state.activeAuction?.createdAt ?? '').toLocaleDateString()}`}
            </Text>
          </CardContent>
        </div>

        <Icons.ArrowRight className="text-gray-accent animate-horizontal-shaking repeat-infinite duration-[4s]" />
      </Card>

      <div className="flex gap-x-4 items-center">
        <Divider orientation="horizontal" />
        <Text className="text-gray-accent" asSpan>Или</Text>
        <Divider orientation="horizontal" />
      </div>

      <div className="flex border-1 border-dark-accent border-dashed rounded-large h-28 hover:border-gray/70">
        <Button
          variant="ghost"
          className="w-full h-full text-gray-accent hover:text-white"
          startContent={<Icons.Plus />}
          disabled={createAuctionMutationState.isLoading}
          loading={createAuctionMutationState.isLoading}
          onClick={createAuction}
        >
          Создать новый аукцион
        </Button>
      </div>
    </WizardItem>
  )
}

type useGetUserAuctionsOptions = {
  immediately?: boolean
  onSuccess?: (auction: NullablePossible<Auction>) => void
  onError?: () => void
}

function useGetUserAuctions(options?: useGetUserAuctionsOptions) {
  const [activeAuction, setActiveAuction] = useState<NullablePossible<Auction>>(null)

  const { currentStepId } = useWizardContext()

  const getActiveAuctions = async () => {
    if (currentStepId !== WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION)
      return

    const getUserResponse = await getAuthUser()

    if (getUserResponse.status !== 200 || !getUserResponse.data) {
      options?.onError?.()

      return
    }

    const getAuctionResponse = await getUserAuctions({ userUUID: getUserResponse.data.userUUID })

    if (getAuctionResponse.status !== 200) {
      options?.onError?.()

      return
    }

    setActiveAuction(getAuctionResponse.data[0] ?? null)
  }

  const getActiveAuctionsQuery = useAsync(getActiveAuctions, [currentStepId])

  return {
    state: {
      activeAuction,
      queryState: getActiveAuctionsQuery,
    },
    actions: {
      getActiveAuctionsQuery,
    },
  }
}

type UseCreateNewAuctionOptions = {
  onSuccess?: (auctionParams: CreateAuctionQueryReturnValue) => void
  onError?: () => void
}

function useCreateNewAuction(options?: UseCreateNewAuctionOptions) {
  const { currentStepId } = useWizardContext()

  const [createAuctionMutation, createAuctionMutationState] = useCreateAuctionMutation()

  const createAuction = async () => {
    if (currentStepId !== WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION)
      return

    const createdAuctionResponse = await createAuctionMutation()

    if (createdAuctionResponse.error) {
      options?.onError?.()
      return
    }

    options?.onSuccess?.(createdAuctionResponse.data)
  }

  return {
    state: {
      mutationState: createAuctionMutationState,
    },
    actions: {
      createAuction,
    },
  }
}
