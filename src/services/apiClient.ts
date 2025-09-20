import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const token = import.meta.env.VITE_GITHUB_TOKEN;

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
