import fs, { PathLike } from 'node:fs'
import { loadEnv } from 'vitepress'

export type StreamerInfoDTO = {
  id: number,
  userUUID: string,
  avatarUrl: string | null
  twitchDisplayName: string,
  isBanned: boolean,
  banReason: null,
  createdAt: string,
  updatedAt: string,
  link: string
}

export type StreamerInfo = {
  name: string,
  avatarUrl: string | null
  link: string
}

type AcceptedStreamers = {
  [streamerName: string]: StreamerInfo
}

// export default {
//   watch: ['../data/accepted-streamers.json'],
//   async load(watchedFiles: PathLike[]) {
//     const streamersListFilePath = watchedFiles[0]

//     const list = await JSON.parse(fs.readFileSync(streamersListFilePath, 'utf-8')) as AcceptedStreamers

//     return Object.values(list)
//   }
// }

export const env = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  ''
)

export default {
  async load() {
    try {
      const baseURL = env.SERVER_URL

      // await fetch(`${baseURL}/auth/login-admin`, {
      //   body: JSON.stringify(
      //     {
      //       login: env.LOGIN,
      //       password: env.PASSWORD
      //     }
      //   ),
      //   method: "POST"
      // })

      const streamersDTOList = [] as StreamerInfoDTO[]

      let page = 1;
      const limit = 50;

      let hasMoreData = true;

      while (hasMoreData) {
        const response = await fetch(`${baseURL}/users?page=${page}&limit=${limit}`,
          {
            body: JSON.stringify({ secret: env.API_SECRET_KEY }), method: "POST",
          })

        if (response.status !== 200) {
          throw new Error("Can't get streamers list from server")
        }

        const items = (await response.json()).items as StreamerInfoDTO[]
        streamersDTOList.push(...items)

        if (items.length < limit) {
          hasMoreData = false
        }
        else {
          page += 1;
        }
      }

      return streamersDTOList.map<StreamerInfo>(dto => ({ name: dto.twitchDisplayName, avatarUrl: dto.avatarUrl, link: '' }))
    }
    catch (error) {
      throw error
    }
  }
}
