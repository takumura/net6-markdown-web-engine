import { DocumentRef } from 'src/app/store/models/document-ref.model';

export interface CategorizedSearchResult {
  category: string;
  docs: DocumentRef[];
  count: number;
}
