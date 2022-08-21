import { Action, createReducer, on } from '@ngrx/store';

import lunr from 'lunr';
import documentJson from 'src/assets/index.json';
import ja from 'src/app/markdown-document/lunr.ja.js';
import { searchResultSortBy } from 'src/app/markdown-document/search/sort-by-options.interface';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { DocumentSearch } from 'src/app/store/models/document-search.model';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';
import { loadDocuments, searchDocuments } from './markdown-document.action';

type Ilunr = (config: lunr.ConfigFunction) => lunr.Index;
type JPlunr = Ilunr & {
  ja: any;
};

// Setup Japanese support for lunr
ja(lunr);

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

export const lunrIndex = lunr((builder) => {
  builder.use((lunr as unknown as JPlunr).ja);
  builder.field('title', { extractor: (doc: {}) => (doc as DocumentRef).content.title });
  builder.field('category', { extractor: (doc: {}) => (doc as DocumentRef).content.category });
  builder.field('body', { extractor: (doc: {}) => (doc as DocumentRef).content.body });
  builder.ref('docRef');

  documents.forEach((doc) => {
    builder.add(doc);
  });
});

const initialState: State = {
  documentIndex: documents,
  documentSearch: { searchWord: '', tag: '', sortBy: searchResultSortBy.dateLatest },
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
    documentSearch: { searchWord: payload.search, tag: state.documentSearch.tag, sortBy: payload.sortBy ?? 0 },
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
