import { routerReducer } from '@ngrx/router-store';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromMarkdownDocument from './markdown-documents/markdown-document.reducer';

interface State {}

export const reducers: ActionReducerMap<State> = {
  markdownDocument: fromMarkdownDocument.reducer,
  router: routerReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
