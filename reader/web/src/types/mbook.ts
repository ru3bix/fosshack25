export interface MBookMetadata {
  chapters: string[];
}

export interface MBookState {
  isLoaded: boolean;
  metadata: MBookMetadata | null;
  currentChapter: string | null;
  extractPath: string | null;
  error: string | null;
}