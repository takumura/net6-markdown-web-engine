import { createAction, props } from '@ngrx/store';

export enum markdownDocumentActions {
  loadDocuments = '[Markdown Document] load documents',
  searchDocuments = '[Markdown Document] search documents',
}

export const loadDocuments = createAction(markdownDocumentActions.loadDocuments);

export const searchDocuments = createAction(
  markdownDocumentActions.searchDocuments,
  props<{ search: string; sortBy: number | null }>()
);
