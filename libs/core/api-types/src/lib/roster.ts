export interface RosterEntryDTO {
  readonly username: string;
  readonly articlesCount: number;
  readonly favoritesCount: number;
  readonly firstArticleDate: string | null;
}

export interface RosterResponse {
  readonly roster: ReadonlyArray<RosterEntryDTO>;
  readonly rosterCount: number;
}
