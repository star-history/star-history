export interface QualifyingRepo {
  name: string;
  star_count: number;
}

export interface RepoStats {
  repo_name: string;
  month: string;
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
