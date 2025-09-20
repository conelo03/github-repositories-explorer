/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

interface UserPanelComponentTypes {
  idx: number
  item: any
}

const UserPanelComponent = (props: UserPanelComponentTypes) => {
  const { item, idx } = props
  const [openIndex, setOpenIndex] = useState<boolean>(false)

  const toggle = () => {
    setOpenIndex(!openIndex)
  }

  return (
    <div key={idx} className="border border-gray-700 rounded-md overflow-hidden">
      <button
        onClick={() => toggle()}
        className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-600" />
          <span className="font-semibold">username-{item}</span>
        </div>
        <span>{openIndex ? '▲' : '▼'}</span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${openIndex ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
        <div className="p-4 bg-gray-900">
          <ul className="space-y-2">
            <li className="p-2 bg-gray-800 rounded-md">
              <span className="text-blue-400 font-medium">repository-{item}</span>
              <p className="text-sm text-gray-400">Repository description goes here...</p>
              <p className="text-xs text-gray-500">★ 0 • Forks: 0</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const App = () => {

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
        <header className="bg-gray-800 shadow-md p-4">
          <h1 className="text-xl font-bold">GitHub Repositories Explorer</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search GitHub username..."
            />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item, idx) => (
              <UserPanelComponent key={idx} item={item} idx={idx} />
            ))}
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-gray-500 bg-gray-800">
          Muhamad Ramadhan © 2025
        </footer>
      </div>
    </>
  )
}

export default App
