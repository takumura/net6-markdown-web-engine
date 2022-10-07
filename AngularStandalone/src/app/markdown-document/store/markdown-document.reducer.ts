import { Action, createReducer, on } from '@ngrx/store';

import documentJson from 'src/assets/index.json';
import { searchResultSortBy } from 'src/app/markdown-document/search/sort-by-options.model';
import { searchResultViewType } from 'src/app/markdown-document/search/view-type-options.model';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { DocumentSearch } from 'src/app/store/models/document-search.model';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';
import {
  loadDocuments,
  searchDocuments,
  searchDocumentsByAdvancedOptions,
  updateViewType,
} from './markdown-document.action';

let documents = documentJson.map((x) => {
  const jsonObj = JSON.parse(x) as DocumentRef;
  let result: DocumentRef = {
    docRef: '',
    content: initialMarkdownDocumentModel,
  };

  // get document reference
  if (jsonObj.docRef) result.docRef = jsonObj.docRef;

  // get content
  if (jsonObj.content && typeof jsonObj.content === 'string') {
    result.content = JSON.parse(jsonObj.content) as MarkdownDocument;
  } else {
    result.content = jsonObj.content;
  }

  return result;
});

const initialState: State = {
  documentIndex: documents,
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
  on(
    loadDocuments,
    (state): State => ({
      ...state,
      documentIndex: documents,
    })
  ),
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

export const featureKey = 'markdownDocument';

export interface State {
  documentIndex: DocumentRef[];
  documentSearch: DocumentSearch;
}

export function reducer(state: State | undefined, action: Action) {
  return markdownDocumentReducer(state, action);
}
