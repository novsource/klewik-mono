import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { auctionSelectors } from '~entities/auction/store'

import { DonationCodeDTOSchema, getDonationCodeInfo } from '~shared/api/http/donations'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Text, Title } from '~shared/components/typography'

import { useDebounceCallback, useQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from 'klewik-ui/drawer'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'

export const DonationCodeInfoDrawer = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [inputValue, setInputValue] = useState('')
  const [isInputCodeValidated, setIsInputCodeValidated] = useState(false)
  const [inputErrorMessage, setInputErrorMessage] = useState('')

  const getDonationCodeQuery = useQuery(
    ({ signal }) => getDonationCodeInfo({ auctionUUID, code: inputValue }, { signal }),
    {
      enabled: isInputCodeValidated,
    },
  )

  const debouncedQueryActivation = useDebounceCallback(() => setIsInputCodeValidated(true), 400)

  const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    const codeValidatingResults = DonationCodeDTOSchema.shape.code.safeParse(value)

    if (!codeValidatingResults.success) {
      getDonationCodeQuery.abort()
      debouncedQueryActivation.cancel()

      if (isInputCodeValidated) {
        setIsInputCodeValidated(false)
      }

      setInputErrorMessage('Некорректный код')
    }
    else {
      debouncedQueryActivation()
      setInputErrorMessage('')
    }

    setInputValue(value)
  }

  const isEmptyResults = !getDonationCodeQuery.data?.data && !getDonationCodeQuery.isFetching

  const donationCodeData = getDonationCodeQuery.data?.data

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      {(isTablet) => {
        return (
          <Drawer side={isTablet ? 'right' : 'bottom'}>
            <DrawerTrigger render={<Button startContent={<Icons.DonationCode />}>Проверить донат-код</Button>} />
            <DrawerContent slotClassnames={{ backdrop: 'z-[204]', viewport: 'z-[205]' }}>
              <div className="flex flex-col h-full w-full gap-y-8">
                <Title order={3}>Проверка донат-кодов</Title>

                <Input
                  slotClassNames={{ base: 'w-full' }}
                  label={{ id: 'donationCodeInput', value: 'Донат-код' }}
                  placeholder="Введите донат-код"
                  description="Пример кода: #712g9fs1"
                  errorMessage={inputErrorMessage}
                  startContent={<Icons.DonationCode className="text-gray-light" size="xs" />}
                  spellCheck={false}
                  endContent={getDonationCodeQuery.isFetching ? <Icons.Loading /> : undefined}
                  onChange={handleInputOnChange}
                />

                <div className="flex flex-col gap-y-4">
                  <Text className="text-lg font-semibold" asSpan>Результаты</Text>
                  {isEmptyResults && <Text className="text-sm text-gray-light" asSpan>Ничего не найдено</Text>}
                  {donationCodeData && (
                    <div className="flex flex-col gap-y-3">
                      <div className="flex w-full justify-between items-center">
                        <Text className="text-gray-accent">Желаемое название</Text>
                        <Text className="font-medium">{donationCodeData.title}</Text>
                      </div>
                      {/* <div className="flex w-full justify-between items-center">
                        <Text className="text-gray-accent">Ссылался на слот</Text>
                        <Text className="font-medium">{donationCodeData.slotId}</Text>
                      </div> */}
                      <div className="flex w-full justify-between items-center">
                        <Text className="text-gray-accent">Создан</Text>
                        <Text className="font-medium">{donationCodeData.createdAt}</Text>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </DrawerContent>
          </Drawer>
        )
      }}
    </MediaQueryViewToggler>

  )
}
