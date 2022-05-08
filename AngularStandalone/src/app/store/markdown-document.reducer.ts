import { createReducer, on } from '@ngrx/store';
import { DocumentRef } from './document-ref.model';
import { reload } from './markdown-document.action';
import documentJson from '../../assets/index.json';

export const featureName = 'markdownDocument';
let documents = documentJson.map((x) => JSON.parse(x) as DocumentRef);

export interface State {
  documentIndex: DocumentRef[];
}

export const initialState: State = {
  documentIndex: documents,
};

export const markdownDocumentReducer = createReducer(
  initialState,
  on(
    reload,
    (state): State => ({
      ...state,
      documentIndex: documents,
    })
  )
);
