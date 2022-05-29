import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './markdown-document.reducer';

export const selectMarkdownDocumentState =
  createFeatureSelector<State>(featureName);

export const selectDocuments = createSelector(
  selectMarkdownDocumentState,
  (state) => state?.documentIndex
);

export const selectTags = createSelector(
  selectMarkdownDocumentState,
  (state) => {
    const docTags = state?.documentIndex.map((x) => {
      const content = x.content;
      return content.tag;
    });
    const tags = docTags.reduce((acc, curr) => acc.concat(curr), []);

    const result = new Set<string>(tags);
    // docs.forEach(x => result.add(x));
    return Array.from(result)
      .filter((x) => x !== undefined && x !== null)
      .sort();
  }
);
