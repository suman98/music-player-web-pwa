declare module '@music-library/core' {
  export interface AudioTrack {
    name: string
    artist?: string
    album?: string
    duration?: number
    url?: string
    file?: Blob | File
  }

  export interface MusicLibraryConfig {
    debugMode?: boolean
    autoRestoreLast?: boolean
  }

  export interface MusicLibrary {
    tracks: AudioTrack[]
    load(): Promise<AudioTrack[]>
    reset?(): void
  }

  export function createMusicLibrary(
    config?: MusicLibraryConfig
  ): Promise<MusicLibrary>
}
