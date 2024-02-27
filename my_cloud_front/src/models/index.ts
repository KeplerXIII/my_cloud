import { Dispatch, SetStateAction } from 'react'

export type FetchData<T> = {
  data: T | undefined
  isLoading: boolean
  hasError: Error | null
}

export interface FormData {
  username: string
  password: string
  email: string
}

export interface authBlockProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  setUsername: React.Dispatch<React.SetStateAction<string>>
}

export type FileData = {
  id: number
  author: string
  original_name: string
  size: number
  upload_date: string
  download_date: string
  special_link: string
}

export type FileViewerType = {
  userID: string
  currentData: FileData[]
  setData: Dispatch<SetStateAction<FileData[]>>
}

export type FileButtonType = {
  fileID: number
  userID: string
  setData: Dispatch<SetStateAction<FileData[]>>
}
