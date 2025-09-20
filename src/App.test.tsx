import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App, { RepositoryComponent } from "./App"
import * as githubService from "./services/github.service"
import type { RepositoryType } from "./interfaces/global.inteface"

vi.mock("./services/github.service", () => ({
  getUsersList: vi.fn(),
  getReposList: vi.fn(),
}))

const mockGetUsersList = vi.mocked(githubService.getUsersList)
const mockGetReposList = vi.mocked(githubService.getReposList)

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithClient = (ui: React.ReactNode) => {
  const client = createTestQueryClient()
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  )
}

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders search input and button", () => {
    renderWithClient(<App />)
    expect(
      screen.getByPlaceholderText("Search GitHub username...")
    ).toBeInTheDocument()
    expect(screen.getByText("Search")).toBeInTheDocument()
  })

  it("shows error if pressing Enter with empty keyword", () => {
    renderWithClient(<App />)
    const input = screen.getByPlaceholderText("Search GitHub username...")
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
    expect(
      screen.getByText("Please enter at least 1 character")
    ).toBeInTheDocument()
  })

  it("fetches users when keyword is valid and Enter is pressed", async () => {
    mockGetUsersList.mockResolvedValueOnce({
      items: [
        {
          id: 1,
          login: "octocat",
          avatar_url: "https://github.com/images/error/octocat_happy.gif",
        },
      ],
    })

    renderWithClient(<App />)
    const input = screen.getByPlaceholderText("Search GitHub username...")
    fireEvent.change(input, { target: { value: "octocat" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(screen.getByText("octocat")).toBeInTheDocument()
    })
  })

  it("shows error state when fetch fails", async () => {
    mockGetUsersList.mockRejectedValueOnce(new Error("API Error"))

    renderWithClient(<App />)
    const input = screen.getByPlaceholderText("Search GitHub username...")
    fireEvent.change(input, { target: { value: "fail" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(screen.getByText("Failed to load users.")).toBeInTheDocument()
    })
  })
})

describe("UserPanelComponent", () => {
  it("toggles repositories panel on click", async () => {
    mockGetReposList.mockResolvedValueOnce([
      { name: "repo1", description: "test repo", stargazers_count: 10, forks_count: 5 },
    ])

    renderWithClient(
      <App />
    )

    mockGetUsersList.mockResolvedValueOnce({
      items: [{ id: 2, login: "testuser", avatar_url: "" }],
    })

    const input = screen.getByPlaceholderText("Search GitHub username...")
    fireEvent.change(input, { target: { value: "testuser" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("testuser"))
    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument()
    })
  })
})

describe("RepositoryComponent", () => {
  it("renders repository name, description, stars and forks", () => {
    const repo: RepositoryType = {
      id: 123,
      name: "my-repo",
      description: "A test repository",
      stargazers_count: 42,
      forks_count: 7,
    }

    render(<RepositoryComponent item={repo} />)

    expect(screen.getByText("my-repo")).toBeInTheDocument()
    expect(screen.getByText("A test repository")).toBeInTheDocument()
    expect(screen.getByText(/★ 42 • Forks: 7/)).toBeInTheDocument()
  })

  it("handles missing description", () => {
    const repo: RepositoryType = {
      id: 456,
      name: "empty-repo",
      description: "",
      stargazers_count: 0,
      forks_count: 0,
    }

    render(<RepositoryComponent item={repo} />)

    expect(screen.getByText("empty-repo")).toBeInTheDocument()
    expect(screen.getByText("", { selector: "p" })).toBeInTheDocument()
    expect(screen.getByText(/★ 0 • Forks: 0/)).toBeInTheDocument()
  })
})
