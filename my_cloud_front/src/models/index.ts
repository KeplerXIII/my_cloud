export type DetailedUser = {
    id: number
    name: string
    avatar: string
    details: {
      city: string
      company: string
      position: string
    }
  }
  
  export type User = Pick<DetailedUser, 'id' | 'name'>
  
  export type DetailsProps = {
    info: User
  }
  
  export type FetchData<T> = {
    data: T | undefined
    isLoading: boolean
    hasError: Error | null
  }