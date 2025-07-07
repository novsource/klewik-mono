import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { store, StoreProvider } from '~app/store'

import { auctionSlotsActions } from '~entities/auction-slot/store'

import { formatNumberToIntlString } from '~shared/utils'

import { CREATE_SLOT_FORM_DEFAULT_VALUE } from '../constants'
import { CreateSlotsForm } from '../ui'

const FORM_TEST_ID = 'createSlotsForm'

describe('### Form with single slot', () => {
  it('should be rendered', () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const form = screen.getByTestId(FORM_TEST_ID)

    expect(form).toBeDefined()
  })

  it('should be rendered without tabs', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const tabs = screen.queryByRole('tablist')

    expect(tabs).toBeNull()
    expect(screen.getByPlaceholderText('Название слота')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Очки')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Шанс')).toBeInTheDocument()
  })

  it('should not allow adding slots that are already participating in the auction', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots maxCreatingSlotsCount={2} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const dublicatedTitle = 'Exist slot'

    await act(() => [
      store.dispatch(auctionSlotsActions.addSlots([{ color: '#FFF', id: 100, points: 1000, title: dublicatedTitle }])),
    ])

    const firstTabTitleInput = screen.getByPlaceholderText('Название слота') satisfies HTMLInputElement

    await userEvent.type(firstTabTitleInput, dublicatedTitle)

    expect(screen.queryByText('Этот слот уже участвует в аукционе')).toBeInTheDocument()
  })
})

describe('### Slot title input', () => {
  it('should respond correctly to input size', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotTitleInput = screen.getByPlaceholderText('Название слота') satisfies HTMLInputElement

    await userEvent.type(slotTitleInput, 'Test')

    expect(slotTitleInput.value.length).toBe(4)

    await userEvent.type(slotTitleInput, Array.from({ length: 40 }).fill('t').join(''))
    expect(slotTitleInput.value.length).toBe(35)
  })

  it('should show error message when input size incorrect', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotTitleInput = screen.getByPlaceholderText('Название слота') satisfies HTMLInputElement

    await userEvent.type(slotTitleInput, 'Te')
    expect(screen.queryByText('Слишком короткое название слота. Минимальный размер - 3 символа')).not.toBeNull()

    await userEvent.type(slotTitleInput, 'Test')
    expect(screen.queryByText('Слишком короткое название слота. Минимальный размер - 3 символа')).toBeNull()
  })
})

describe('### Slots points input', () => {
  it('should be render with default value', () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotPointsInput = screen.getByPlaceholderText('Очки') satisfies HTMLInputElement

    expect(slotPointsInput.value.length).not.toBe(0)
    expect(slotPointsInput).toHaveValue()
  })

  it('should only accept numbers', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotPointsInput = screen.getByPlaceholderText('Очки') satisfies HTMLInputElement

    await userEvent.clear(slotPointsInput)
    expect(slotPointsInput).not.toHaveValue()

    await userEvent.type(slotPointsInput, 'Test')
    expect(slotPointsInput).not.toHaveValue()

    await userEvent.type(slotPointsInput, '1000')
    expect(slotPointsInput).toHaveValue()
  })

  it('should correctly format numbers to the international standard', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotPointsInput = screen.getByPlaceholderText('Очки') satisfies HTMLInputElement

    const numToFormat = 100000

    await userEvent.clear(slotPointsInput)
    await userEvent.type(slotPointsInput, numToFormat.toString())

    /*
      "formatNumberToIntlString" uses Intl to format the string to international format
      Intl uses non-breaking spaces (code 160) instead of regular spaces (code 32)
      Therefore, to prepare strings for comparison, it is necessary to replace the space
    */

    /* eslint-disable no-control-regex */
    const targetFormattedString = formatNumberToIntlString(numToFormat).replace(/[^\u0000-\u007F]+/g, ' ')

    expect(slotPointsInput).toHaveValue()
    expect(slotPointsInput.value).toBe(targetFormattedString)
  })

  it('should affect the percentage field', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const { auctionSlots } = store.getState()
    const newPoints = 20000

    const pointsInput = screen.getByPlaceholderText('Очки') satisfies HTMLInputElement
    const percentsInput = screen.getByPlaceholderText('Шанс') satisfies HTMLInputElement

    await userEvent.clear(pointsInput)
    await userEvent.type(pointsInput, newPoints.toString())

    const pointsToPercents = (100 * newPoints) / (newPoints + auctionSlots.slotsPointsSum)

    expect(percentsInput.value).toBe(pointsToPercents.toFixed(2))

    await userEvent.clear(pointsInput)
    expect(percentsInput.value).toBe('0')
  })

  it('should return default value if field was empty after focus', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const pointsInput = screen.getByPlaceholderText('Очки') satisfies HTMLInputElement
    const percentsInput = screen.getByPlaceholderText('Шанс') satisfies HTMLInputElement

    await userEvent.clear(pointsInput)
    expect(pointsInput).not.toHaveValue()

    await waitFor(() => {
      fireEvent.blur(pointsInput)
    })

    const defaultPointsValue = Number(CREATE_SLOT_FORM_DEFAULT_VALUE.points)

    const { auctionSlots } = store.getState()

    const formattedDefaultValue
      = formatNumberToIntlString(defaultPointsValue)
        .replace(/[^\u0000-\u007F]+/g, ' ')

    const pointsToPercents = (100 * defaultPointsValue) / (defaultPointsValue + auctionSlots.slotsPointsSum)

    expect(pointsInput.value).toBe(formattedDefaultValue)
    expect(Number(percentsInput.value).toFixed(2)).toBe(pointsToPercents.toFixed(2))
  })
})

describe('### Slots percents input', () => {
  it('should be render with default value', () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotPercentsInput = screen.getByPlaceholderText('Шанс') satisfies HTMLInputElement

    expect(slotPercentsInput.value.length).not.toBe(0)
    expect(slotPercentsInput).toHaveValue()
  })

  it('should only accept numbers', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotPercentsInput = screen.getByPlaceholderText('Шанс') satisfies HTMLInputElement

    await userEvent.clear(slotPercentsInput)
    expect(slotPercentsInput).not.toHaveValue()

    await userEvent.type(slotPercentsInput, 'Test')
    expect(slotPercentsInput).not.toHaveValue()

    await userEvent.type(slotPercentsInput, '50')
    expect(slotPercentsInput).toHaveValue()
  })

  it('should correctly format numbers to the international standard', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const slotPercentsInput = screen.getByPlaceholderText('Шанс') satisfies HTMLInputElement

    const numToFormat = 10.56

    await userEvent.clear(slotPercentsInput)
    await userEvent.type(slotPercentsInput, numToFormat.toString())

    const targetFormattedString
      = formatNumberToIntlString(numToFormat, { locales: 'us-US' })
        .replace(/[^\u0000-\u007F]+/g, ' ')

    expect(slotPercentsInput).toHaveValue()
    expect(slotPercentsInput.value).toBe(targetFormattedString)
  })

  it('should return default value if field was empty after focus', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots={false} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const pointsInput = screen.getByPlaceholderText('Очки') satisfies HTMLInputElement
    const percentsInput = screen.getByPlaceholderText('Шанс') satisfies HTMLInputElement

    await userEvent.clear(percentsInput)
    expect(percentsInput).not.toHaveValue()

    await waitFor(() => {
      fireEvent.blur(percentsInput)
    })

    const { auctionSlots } = store.getState()

    const defaultPointsValue = Number(CREATE_SLOT_FORM_DEFAULT_VALUE.points)

    const targetFormattedString = formatNumberToIntlString(defaultPointsValue).replace(/[^\u0000-\u007F]+/g, ' ')

    const pointsToPercents = (100 * defaultPointsValue) / (defaultPointsValue + auctionSlots.slotsPointsSum)

    expect(pointsInput.value).toBe(targetFormattedString)
    expect(percentsInput.value).toBe(pointsToPercents.toFixed(2))
  })
})

describe('### Form with multiply slots', () => {
  it('should be rendered', () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const form = screen.getByTestId(FORM_TEST_ID)

    expect(form).toBeDefined()
  })

  it('should be rendered with tab', () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    expect(screen.queryByRole('tablist')).toBeInTheDocument()
  })

  it('should allow creating new tabs', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const tabContainer = screen.queryByRole('tablist')
    expect(tabContainer).not.toBeNull()

    const tabs = tabContainer?.getElementsByTagName('button')
    expect(tabs).not.toBeUndefined()
    expect(tabs?.length).toBe(2)

    const createTabsButton = tabs?.item(1)
    await userEvent.click(createTabsButton!)

    expect(tabs?.length).toBe(3)
  })

  it('should limit the number of slots in the tab', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots maxCreatingSlotsCount={2} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const tabContainer = screen.queryByRole('tablist')
    const tabs = tabContainer?.getElementsByTagName('button')
    expect(tabs?.length).toBe(2)

    const createTabsButton = tabs?.item(1)
    await userEvent.click(createTabsButton!)

    expect(createTabsButton).not.toBeInTheDocument()
    expect(tabs?.length).toBe(2)
  })

  it('should be identical content on the new tabs', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots maxCreatingSlotsCount={2} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    expect(screen.getByPlaceholderText('Название слота')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Очки')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Шанс')).toBeInTheDocument()

    const tabContainer = screen.queryByRole('tablist')
    const tabs = tabContainer?.getElementsByTagName('button')
    expect(tabs?.length).toBe(2)

    const createTabsButton = tabs?.item(1)
    await userEvent.click(createTabsButton!)

    const secondTab = tabs?.item(1)
    await userEvent.click(secondTab!)

    expect(screen.getByPlaceholderText('Название слота')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Очки')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Шанс')).toBeInTheDocument()
  })

  it('should check for duplicate slot titles in tabs', async () => {
    render(
      <StoreProvider>
        <CreateSlotsForm multiplySlots maxCreatingSlotsCount={2} data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const dublicatedTitle = 'Test'

    let firstTabTitleInput = screen.getByPlaceholderText('Название слота')
    await userEvent.type(firstTabTitleInput, dublicatedTitle)

    const tabContainer = screen.queryByRole('tablist')
    const tabs = tabContainer?.getElementsByTagName('button')
    expect(tabs?.length).toBe(2)

    const createTabsButton = tabs?.item(1)
    await userEvent.click(createTabsButton!)

    const secondSlotTab = tabs?.item(1)
    await userEvent.click(secondSlotTab!)

    const secondTabTitleInput = screen.getByPlaceholderText('Название слота')

    await userEvent.type(secondTabTitleInput, dublicatedTitle)

    const firstSlotTab = tabs?.item(0)
    await userEvent.click(firstSlotTab!)

    expect(screen.queryByText('Слот с таким именем уже есть в форме')).not.toBeNull()

    firstTabTitleInput = screen.getByPlaceholderText('Название слота')

    await userEvent.type(firstTabTitleInput, `${dublicatedTitle}test`)
    expect(screen.queryByText('Слот с таким именем уже есть в форме')).toBeNull()
  })
})
