export type ErrorStatusesWithReason = 404 | 500 | 401

export const errorStatusReasons: Record<ErrorStatusesWithReason, string> = {
  404: 'Аукцион не найден или был удален',
  500: 'Ошибка сервера: попробуйте перезагрузить страницу',
  401: 'Не удалось авторизовать пользователя. Попробуйте войти в аукцион через главную страницу',
} as const
