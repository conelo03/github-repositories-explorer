export interface UserType {
  id: number;
  login: string;
  avatar_url: string;
}

export interface RepositoryType {
  id: number;
  name: string;
  description: string | null;
  forks_count: number;
  stargazers_count: number;
}
