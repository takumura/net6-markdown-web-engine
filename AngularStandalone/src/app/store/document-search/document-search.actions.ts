import { createAction, props } from '@ngrx/store';

export enum documentSearchActions {
  searchDocuments = '[Markdown Document Search] search documents',
  searchDocumentsByAdvancedOptions = '[Markdown Document Search] search documents by Advanced Options',
  updateViewType = '[Markdown Document Search] update view type',
}

export const searchDocuments = createAction(
  documentSearchActions.searchDocuments,
  props<{ search: string; sortBy: number | null }>()
);

export const searchDocumentsByAdvancedOptions = createAction(
  documentSearchActions.searchDocumentsByAdvancedOptions,
  props<{ tags: string[] | null; category: string | null }>()
);

export const updateViewType = createAction(documentSearchActions.updateViewType, props<{ viewType: number }>());
