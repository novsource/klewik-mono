import { expect, test } from '@playwright/test'

const HOME_LOCAL_DEV_URL = 'http://localhost:5173/'

test.beforeEach(async ({ page }) => {
  await page.goto(HOME_LOCAL_DEV_URL)
})

test.describe('@welcome-page-content', () => {
  test('should match welcome page screenshot', async ({ page, context }) => {
    await expect(page).toHaveScreenshot('landtop:welcome-page.png')
    const desktopPage = await context.newPage()

    desktopPage.setViewportSize({ width: 1920, height: 1080 })
    await desktopPage.goto(HOME_LOCAL_DEV_URL)
    await expect(desktopPage).toHaveScreenshot('desktop:welcome-page.png')
  })

  test('should correct show welcome slider content', async ({ page }) => {
    expect(
      page.getByText('Добро пожаловать в поинтовый аукцион!')
    ).toBeVisible()
    expect(page.getByText('Войти в аукцион')).toBeVisible()
    expect(page.getByText('Создать аукцион')).toBeVisible()
  })

  test('should correct show create auction slider content', async ({
    page,
  }) => {
    expect(page.getByText('Создать аукцион')).toBeVisible()

    await page.getByText('Создать аукцион').click()

    await expect(page).toHaveScreenshot('welcome-page:create-slider-master.png')

    const sliderContentTitle = page.getByText('Создание нового аукциона')

    expect(sliderContentTitle).toBeVisible()
    expect(sliderContentTitle.evaluate((e) => e.tagName)).toBe('h1')

    const sliderDescription = page.getByText(
      'Для продолжения введите выданный вам мастер-ключ. Позже он также будет использоваться вами для входа в аукцион в роли администратора. После ввода нажмите кнопку "Создать"'
    )

    expect(sliderDescription).toBeVisible()
    expect(sliderDescription.evaluate((e) => e.tagName)).toBe('p')

    const goToBackBtn = page.getByText('Назад')
    expect(goToBackBtn).toBeVisible()

    const keyInput = page.getByLabel('Мастер-ключ')
    expect(keyInput).toBeVisible()

    await goToBackBtn.click()
    await expect(page).toHaveScreenshot('welcome-page.png')
  })
})

test.describe('@create-auction', () => {
  test('should correct navigate to create auction form', async ({ page }) => {
    const goToCreateAuctionButton = page.getByText('Создать аукцион')

    await goToCreateAuctionButton.click()
  })
})
