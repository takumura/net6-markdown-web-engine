import { createAction } from '@ngrx/store';

export enum documentIndexActions {
  loadDocuments = '[Markdown Document Index] load documents',
}

export const loadDocuments = createAction(documentIndexActions.loadDocuments);
