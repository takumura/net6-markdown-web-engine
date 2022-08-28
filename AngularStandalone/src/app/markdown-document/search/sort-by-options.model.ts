export const searchResultSortBy = {
  dateLatest: 0,
  dateOldest: 1,
  hitIndex: 2,
  aToZ: 3,
  zToA: 4,
} as const;

export interface sortByOption {
  key: number;
  value: string;
}
