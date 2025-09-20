# GitHub Repositories Explorer

A simple React application built with **Vite**, **TailwindCSS**, and **TanStack Query** that integrates with the **GitHub API**.  
The app allows users to:

- Search GitHub users (up to 5 results)
- Expand a user panel to view their repositories (with infinite scroll pagination)
- Handle loading and error states gracefully
- Tested using **Vitest** and **React Testing Library**

---

## ✨ Features

- 🔍 Search GitHub users by username
- 📂 View public repositories for selected users
- ♾️ Infinite scroll for repositories (auto fetch on scroll)
- 🎨 Styled with TailwindCSS
- ⚡ Fast build & dev with Vite
- 🧪 Unit tests with Vitest

---

## 🎥 Demo

### Live Preview
[![Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=github)](https://github-repositories-explorer-ebon.vercel.app/)

---

## 🛠️ Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/github-repos-explorer.git
cd github-repos-explorer
````

### 2. Install dependencies

```bash
npm install
```

### 3. Setup GitHub API Token (optional but recommended)

Create a **`.env`** file in the root:

```env
VITE_GITHUB_TOKEN=your_personal_access_token
```

> 🔑 You can generate a GitHub token from [GitHub Developer Settings](https://github.com/settings/tokens).
> If no token is provided, the app will still work but might hit GitHub’s rate limits (60 requests/hour).

### 4. Run the dev server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Running Tests

This project uses **Vitest** + **React Testing Library**.

```bash
npm run test
```

---

## 📂 Project Structure

```
src/
├── App.tsx                 # Main app component
├── services/
│   │── apiClient.ts        # API Instance (Axios)
│   └── github.service.ts   # API requests (users & repos)
├── interfaces/
│   └── global.interface.ts # TypeScript interfaces
├── utils/
│   └── helper.ts           # Helper
├── __tests__/              # Unit tests (Vitest + RTL)
│   └── App.test.tsx
```

---

## 📜 License

MIT © 2025 Muhamad Ramadhan
