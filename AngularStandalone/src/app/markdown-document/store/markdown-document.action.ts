import { createAction, props } from '@ngrx/store';

export enum markdownDocumentActions {
  loadDocuments = '[Markdown Search] load documents',
  searchDocuments = '[Markdown Search] search documents',
  searchDocumentsByAdvancedOptions = '[Markdown Search] search documents by Advanced Options',
  updateViewType = '[Markdown Search] update view type',
}

export const loadDocuments = createAction(markdownDocumentActions.loadDocuments);

export const searchDocuments = createAction(
  markdownDocumentActions.searchDocuments,
  props<{ search: string; sortBy: number | null }>()
);

export const searchDocumentsByAdvancedOptions = createAction(
  markdownDocumentActions.searchDocumentsByAdvancedOptions,
  props<{ tags: string[] | null; category: string | null }>()
);

export const updateViewType = createAction(markdownDocumentActions.updateViewType, props<{ viewType: number }>());
