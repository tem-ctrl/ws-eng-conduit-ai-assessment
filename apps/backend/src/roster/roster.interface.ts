export interface IRosterEntry {
  username: string;
  articlesCount: number;
  favoritesCount: number;
  firstArticleDate: string | null;
}

export interface IRosterRO {
  roster: IRosterEntry[];
}
