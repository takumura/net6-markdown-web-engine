import { Action, createReducer, on } from '@ngrx/store';

import { loadDocuments } from './document-index.actions';
import { DocumentRef } from '../models/document-ref.model';
import documentJson from 'src/assets/index.json';
import { initialMarkdownDocumentModel, MarkdownDocument } from '../models/markdown-document.model';

export const featureKey = 'documentIndex';

export interface State {
  documentIndex: DocumentRef[];
}

export function reducer(state: State | undefined, action: Action) {
  return documentIndexReducer(state, action);
}

const initialState: State = {
  documentIndex: [],
};

const documents = documentJson.map((x) => {
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

const documentIndexReducer = createReducer(
  initialState,
  on(
    loadDocuments,
    (state): State => ({
      ...state,
      documentIndex: documents,
    })
  )
);
