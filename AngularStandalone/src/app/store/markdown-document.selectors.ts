import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './markdown-document.reducer';

export const selectMarkdownDocumentState =
  createFeatureSelector<State>(featureName);
export const selectDocuments = createSelector(
  selectMarkdownDocumentState,
  (state) => state?.documentIndex
);
