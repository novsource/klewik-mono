import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StoreProvider } from '~app/store/store-provider'

import { CreateAuctionForm } from '../ui'

const FORM_TEST_ID = 'createAuctionForm'

describe('### Form', () => {
  it('should be rendered', () => {
    render(
      <StoreProvider>
        <CreateAuctionForm data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    expect(screen.queryByTestId(FORM_TEST_ID)).toBeInTheDocument()
  })

  it('should validate the master key', async () => {
    render(
      <StoreProvider>
        <CreateAuctionForm data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const form = screen.getByTestId(FORM_TEST_ID)

    const keyInput = form.querySelector('input')
    expect(keyInput).not.toBeNull()

    const formButtons = form.querySelectorAll('button')
    const submitFormButton = formButtons[formButtons.length - 1]

    expect(submitFormButton.getAttribute('disabled')).not.toBeNull()

    await userEvent.type(keyInput!, 'e8ca17cd-8292-437d-91b5-09b469648')
    expect(submitFormButton.disabled).toBeTruthy()
    expect(screen.queryByText('Неверный формат ключа')).toBeInTheDocument()

    await userEvent.clear(keyInput!)
    await userEvent.type(keyInput!, 'e8ca17cd-8292-437d-91b5-09b469648297')

    expect(submitFormButton.disabled).toBeFalsy()
    expect(screen.queryByText('Неверный формат ключа')).not.toBeInTheDocument()
  })

  it('should block the confirm button until validated', async () => {
    render(
      <StoreProvider>
        <CreateAuctionForm data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const form = screen.getByTestId(FORM_TEST_ID)

    const keyInput = form.querySelector('input')
    expect(keyInput).not.toBeNull()

    const formButtons = form.querySelectorAll('button')
    const submitFormButton = formButtons[formButtons.length - 1]

    expect(submitFormButton.getAttribute('disabled')).not.toBeNull()

    await userEvent.type(keyInput!, 'e8ca17cd-8292-437d-91b5-09b469648297')
    expect(submitFormButton.getAttribute('disabled')).toBeNull()
  })

  it('should change the visibility of the key by icon button', async () => {
    render(
      <StoreProvider>
        <CreateAuctionForm data-testid={FORM_TEST_ID} />
      </StoreProvider>,
    )

    const form = screen.getByTestId(FORM_TEST_ID)

    const keyInput = form.querySelector('input')
    expect(keyInput!.getAttribute('type')).toBe('password')

    const changeKeyVisibilityButton = form.getElementsByTagName('button')[0]

    await userEvent.click(changeKeyVisibilityButton)
    expect(keyInput!.getAttribute('type')).toBe('text')

    await userEvent.click(changeKeyVisibilityButton)
    expect(keyInput!.getAttribute('type')).toBe('password')
  })
})
