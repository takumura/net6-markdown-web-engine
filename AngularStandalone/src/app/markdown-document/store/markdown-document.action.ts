import { createAction, props } from '@ngrx/store';

export enum markdownDocumentActions {
  loadDocuments = '[Markdown Search] load documents',
  searchDocuments = '[Markdown Search] search documents',
  updateViewType = '[Markdown Search] update view type',
}

export const loadDocuments = createAction(markdownDocumentActions.loadDocuments);

export const searchDocuments = createAction(
  markdownDocumentActions.searchDocuments,
  props<{ search: string; sortBy: number | null }>()
);

export const updateViewType = createAction(markdownDocumentActions.updateViewType, props<{ viewType: number }>());
