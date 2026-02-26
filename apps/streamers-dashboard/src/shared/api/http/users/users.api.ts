import type { AuctionDTO } from '../auction'
import type { UserDTO } from './users.types'

import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'
import { baseHttpClient } from '../base-api'

type GetUserByTwitchNicknameResponseData = UserDTO

export const getUserByTwitchNickname = (nickname: string, options?: HttpClientRequestOptions) => {
  return baseHttpClient.get<GetUserByTwitchNicknameResponseData>(`/api/v1/users/twitch/${nickname}`, options)
}

type GetUserAuctionsRequestArgs = {
  userId: number
}

/*
  Here we can get user info by jwt token payload
*/
export const getAuthUser = (options?: HttpClientRequestOptions) => {
  return authHttpClient.post<UserDTO>('/api/v1/users', options)
}

export const getUserAuctions = (args: GetUserAuctionsRequestArgs, options?: HttpClientRequestOptions) => {
  return authHttpClient.post<AuctionDTO[]>(`/api/v1/users/${args.userId}/auctions`, options)
}
