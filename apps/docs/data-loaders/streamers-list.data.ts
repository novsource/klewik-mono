import fs, { PathLike } from 'node:fs'

type StreamerInfo = {
  name: string,
  link: string
}

type AcceptedStreamers = {
  [streamerName: string]: StreamerInfo
}

export default {
  watch: ['../data/accepted-streamers.json'],
  load(watchedFiles: PathLike[]) {
    const streamersListFilePath = watchedFiles[0]

    const list = JSON.parse(fs.readFileSync(streamersListFilePath, 'utf-8')) as AcceptedStreamers

    return Object.values(list)
  }
}
