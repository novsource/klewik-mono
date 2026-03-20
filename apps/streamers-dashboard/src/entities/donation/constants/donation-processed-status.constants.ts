import type { ProcessedDonationStatus } from '../model'

export const DONATION_PROCESSED_STATUS: Record<ProcessedDonationStatus, string> = {
  added: 'Добавлено',
  inProgress: 'Обрабатывается',
  checkRequested: 'Ожидание проверки',
  error: 'Ошибка',
  empty: 'Нет данных',
  rejected: 'Отклонено',
}
