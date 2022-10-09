import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromDocumentSearch from './document-search.reducer';
import { sortByDate, sortByTitle } from 'src/app/shared/utils/ordering';
import { environment } from 'src/environments/environment';
import { selectDocuments } from '../document-index/document-index.selectors';
import { DocumentRef } from '../models/document-ref.model';
import { searchResultSortBy } from '../models/sort-by-options.model';

const selectDocumentSearchState = createFeatureSelector<fromDocumentSearch.State>(fromDocumentSearch.featureKey);

export const selectFilteredDocuments = createSelector(
  selectDocumentSearchState,
  selectDocuments,
  (state, documentIndex) => {
    let filteredDocuments: DocumentRef[] = documentIndex.filter(
      (x) => !environment.ignoreListForCategory.some((c) => c === x?.content?.category.toLowerCase())
    );

    if (!state.documentSearch.searchWord && !state.documentSearch.tags) {
      return getOrderedDocumentIndex(state, filteredDocuments);
    }

    // filter by search keywork
    filteredDocuments = filteredDocuments.filter(
      (x) =>
        x.content?.title.indexOf(state.documentSearch.searchWord) !== -1 ||
        x.content?.category.indexOf(state.documentSearch.searchWord) !== -1 ||
        x.content?.body.indexOf(state.documentSearch.searchWord) !== -1
    );

    // filter by category
    if (state.documentSearch.category) {
      filteredDocuments = filteredDocuments.filter((x) => x.content?.category === state.documentSearch.category);
    }

    //filter by tags
    if (state.documentSearch.tags && state.documentSearch.tags.length > 0) {
      filteredDocuments = filteredDocuments.filter((x) => {
        if (!x.content.tag || x.content.tag?.length === 0) {
          return false;
        } else {
          return state.documentSearch.tags.every((t) => x.content.tag.indexOf(t) !== -1);
        }
      });
    }

    return getOrderedDocumentIndex(state, filteredDocuments);
  }
);

export const selectHasAdvancedOptions = createSelector(selectDocumentSearchState, (document) => {
  return !!document?.documentSearch?.category || document?.documentSearch?.tags?.length > 0;
});

export const selectSearchCategory = createSelector(
  selectDocumentSearchState,
  (state) => state?.documentSearch?.category
);

export const selectSearchTags = createSelector(selectDocumentSearchState, (state) => state?.documentSearch?.tags);

export const selectSearchWord = createSelector(selectDocumentSearchState, (state) => state?.documentSearch?.searchWord);

export const selectViewType = createSelector(selectDocumentSearchState, (state) => state?.documentSearch.viewType);

function getOrderedDocumentIndex(state: fromDocumentSearch.State, documentIndex: DocumentRef[]) {
  let index = [...documentIndex];

  switch (state.documentSearch.sortBy) {
    case searchResultSortBy.dateLatest:
      return index.sort(sortByDate(true));
    case searchResultSortBy.dateOldest:
      return index.sort(sortByDate(false));
    case searchResultSortBy.aToZ:
      return index.sort(sortByTitle(false));
    case searchResultSortBy.zToA:
      return index.sort(sortByTitle(true));
    default:
      return documentIndex;
  }
}
