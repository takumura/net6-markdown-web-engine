export const searchResultSortBy = {
  dateLatest: 0,
  dateOldest: 1,
  aToZ: 2,
  zToA: 3,
} as const;

export interface sortByOption {
  key: number;
  value: string;
}
