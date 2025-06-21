import { ProcessedDonationStatus } from '../model'

const DONATION_PROCESSED_STATUS: Record<ProcessedDonationStatus, string> = {
  added: 'Добавлено',
  inProgress: 'Обрабатывается',
  checkRequested: 'Необходима проверка',
  error: 'Ошибка обработки',
  empty: 'Данные не найдены',
  rejected: 'Отклонено',
}

export { DONATION_PROCESSED_STATUS }
