export interface QualifyingRepo {
  name: string;
  star_count: number;
  description: string | null;
  language: string | null;
  topics: string[];
  license: string | null;
  homepage: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  forks_count: number;
  open_issues_count: number;
  size: number;
  archived: boolean;
  owner_type: string;
}

export interface RepoStats {
  repo_name: string;
  week: string;
  new_stars: number;
  new_forks: number;
  issues_opened: number;
  issues_closed: number;
  prs_opened: number;
  prs_merged: number;
  pushes: number;
  commits: number;
  releases: number;
  review_comments: number;
  unique_contributors: number;
}
