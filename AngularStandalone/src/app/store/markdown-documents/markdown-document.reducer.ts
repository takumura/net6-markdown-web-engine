import { Action, createReducer, on } from '@ngrx/store';
import { DocumentRef } from '../models/document-ref.model';
import { reload } from './markdown-document.action';
import documentJson from '../../../assets/index.json';
import { MarkdownDocument } from '../models/markdown-document.model';

let documents = documentJson.map((x) => {
  const jsonObj = JSON.parse(x) as DocumentRef;
  let result: DocumentRef = {
    docRef: '',
    content: {
      title: '',
      date: '',
      category: '',
      tag: [],
      toc: '',
      body: '',
      bodyHtml: '',
    },
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
};

const markdownDocumentReducer = createReducer(
  initialState,
  on(
    reload,
    (state): State => ({
      ...state,
      documentIndex: documents,
    })
  )
);

export const featureKey= "markdownDocument";

export interface State {
  documentIndex: DocumentRef[];
}

export function reducer(state: State | undefined, action: Action) {
  return markdownDocumentReducer(state, action);
}