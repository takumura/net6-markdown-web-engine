import { Action, createReducer, on } from '@ngrx/store';

import { DocumentSearch } from '../models/document-search.model';
import { searchResultSortBy } from '../models/sort-by-options.model';
import { searchResultViewType } from '../models/view-type-options.model';
import { searchDocuments, searchDocumentsByAdvancedOptions, updateViewType } from './document-search.actions';

export const featureKey = 'documentSearch';

export interface State {
  documentSearch: DocumentSearch;
}

export function reducer(state: State | undefined, action: Action) {
  return markdownDocumentReducer(state, action);
}

const initialState: State = {
  documentSearch: {
    searchWord: '',
    category: '',
    tags: [],
    sortBy: searchResultSortBy.dateLatest,
    viewType: searchResultViewType.standard,
  },
};

const markdownDocumentReducer = createReducer(
  initialState,
  on(searchDocuments, (state: State, payload) => ({
    ...state,
    documentSearch: {
      searchWord: payload.search,
      category: state.documentSearch.category,
      tags: state.documentSearch.tags,
      sortBy: payload.sortBy ?? state.documentSearch.sortBy,
      viewType: state.documentSearch.viewType,
    },
  })),
  on(searchDocumentsByAdvancedOptions, (state: State, payload) => ({
    ...state,
    documentSearch: {
      searchWord: state.documentSearch.searchWord,
      category: payload.category ?? state.documentSearch.category,
      tags: payload.tags ?? state.documentSearch.tags,
      sortBy: state.documentSearch.sortBy,
      viewType: state.documentSearch.viewType,
    },
  })),
  on(updateViewType, (state: State, payload) => ({
    ...state,
    documentSearch: {
      searchWord: state.documentSearch.searchWord,
      category: state.documentSearch.category,
      tags: state.documentSearch.tags,
      sortBy: state.documentSearch.sortBy,
      viewType: payload.viewType ?? state.documentSearch.viewType,
    },
  }))
);
