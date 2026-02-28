export interface RepoAttributes {
  stars: number;
  new_stars: number;
  pushes: number;
  contributors: number;
  issues_closed: number;
  forks: number;
}

export interface RepoCardData {
  name: string;
  owner: string;
  stars_total: number;
  description: string | null;
  language: string | null;
  topics: string[];
  license: string | null;
  homepage: string | null;
  forks_count: number;
  open_issues_count: number;
  created_at: string | null;
  archived: boolean;
  size: number;
  rank: number;
  total_repos: number;
  attributes: RepoAttributes;
}
