import { createAction } from '@ngrx/store';

export enum markdownDocumentActions {
  reload = '[Markdown Document] get',
}

export const reload = createAction(markdownDocumentActions.reload);
