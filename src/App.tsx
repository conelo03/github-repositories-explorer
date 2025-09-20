import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getReposList, getUsersList } from './services/github.service'
import type { RepositoryType, UserType } from './interfaces/global.inteface'

interface UserPanelComponentTypes {
  item: UserType
}

interface RepositoryComponentTypes {
  item: RepositoryType
}

const RepositoryComponent = (props: RepositoryComponentTypes) => {
  const { item } = props

  return (
    <div className="bg-gray-900">
      <ul className="space-y-2">
        <li className="p-2 bg-gray-800 rounded-md">
          <span className="text-blue-400 font-medium">{item?.name}</span>
          <p className="text-sm text-gray-400">{item?.description}</p>
          <p className="text-xs text-gray-500">★ {item?.stargazers_count ?? 0} • Forks: {item?.forks_count ?? 0}</p>
        </li>
      </ul>
    </div>
  )
}

const UserPanelComponent = (props: UserPanelComponentTypes) => {
  const { item } = props
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [openIndex, setOpenIndex] = useState<boolean>(false)

  const toggle = () => {
    setOpenIndex(!openIndex)
  }

  const {
    data: dataRepositories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: ["repos", item?.login],
    queryFn: ({ pageParam }) => getReposList(pageParam, 100, item?.login),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 100) return undefined
      return allPages.length + 1
    },
    refetchOnWindowFocus: false,
    enabled: openIndex
  })

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage()
      }
    })

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <button
        onClick={() => toggle()}
        className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700"
      >
        <div className="flex items-center space-x-3">
          {item?.avatar_url ? (
            <img src={item?.avatar_url} alt={item?.avatar_url} className="w-10 h-10 rounded-full bg-gray-600" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600" />
          )}
          <span className="font-semibold">{item?.login}</span>
        </div>
        <span>{openIndex ? '▲' : '▼'}</span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${openIndex ? "max-h-96 opacity-100 p-4" : "max-h-0 opacity-0"} overflow-auto`}>
        {isLoading && <div className="h-10 flex items-center justify-center">Loading...</div>}
        {status === "error" && <div className="h-10 flex items-center justify-center"> Failed to load repositories.</div>}
        <div className="flex flex-col gap-4">
          {dataRepositories?.pages?.flat().map((item: RepositoryType, idx: number) => (
            <RepositoryComponent key={idx} item={item} />
          ))}
        </div>
        {hasNextPage && <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && "Loading more..."}
        </div>}
      </div>
    </div>
  )
}

const App = () => {
  const [keyword, setKeyword] = useState<string>("")
  const [error, setError] = useState<string>("")
  // const queryClient = useQueryClient()

  const { data: dataUser, isLoading, refetch, status, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersList(keyword),
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  console.log(dataUser)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setError("")
      if (!keyword.trim()) {
        setError("Please enter at least 1 character")
        return
      }
      refetch()
    }
  }

  const handleClick = () => {
    setError("")
    if (keyword.trim()) {
      setError("Please enter at least 1 character")
      return
    }
    refetch()
  }


  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
        <header className="bg-gray-800 shadow-md p-4">
          <h1 className="text-xl font-bold">GitHub Repositories Explorer</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col md:items-start md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            <div className="flex-1 flex flex-col">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`p-2 rounded-md bg-gray-700 border ${error ? "border-red-500" : "border-gray-600"
                  } focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                placeholder="Search GitHub username..."
              />
              {error && (
                <span className="mt-2 text-sm text-red-500">{error}</span>
              )}
            </div>
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Search
            </button>
          </div>

          {isLoading || isFetching && <div className="h-10 flex items-center justify-center">Loading...</div>}
          {!isFetching && status === "error" && <div className="h-10 flex items-center justify-center"> Failed to load users.</div>}

          {!isFetching && status === 'success' && dataUser?.items?.length > 0 && (
            <div className="space-y-3">
              {dataUser?.items?.map((item: UserType, idx: number) => (
                <UserPanelComponent key={idx} item={item} />
              ))}
            </div>
          )}
        </main>

        <footer className="p-4 text-center text-xs text-gray-500 bg-gray-800">
          Muhamad Ramadhan © 2025
        </footer>
      </div>
    </>
  )
}

export default App
