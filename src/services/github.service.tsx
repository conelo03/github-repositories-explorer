import { apiResponseSuccess } from "../utils/helper"
import apiClient from "./apiClient"

export const getUsersList = async (query: string = '') => {
  const response = await apiClient.get(`search/users?q=${query}&per_page=5`)
  if (apiResponseSuccess(response?.status)) {
    return response?.data
  }
  return response
}

export const getReposList = async (page: number = 1, limit: number = 10, username: string = '') => {
  const response = await apiClient.get(`users/${username}/repos?page=${page}&per_page=${limit}`)
  if (apiResponseSuccess(response?.status)) {
    return response?.data
  }
  return response
}
