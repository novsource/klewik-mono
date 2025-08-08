import { HttpResponse } from 'msw'

export const checkPostFormRequestHeaders = (headers: Headers) => {
  const contentType = headers.get('Content-Type')

  if (!contentType || contentType !== 'multipart/form-data') {
    return new HttpResponse(null, { status: 400 })
  }

  return null
}
