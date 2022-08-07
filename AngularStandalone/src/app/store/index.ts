import { routerReducer } from '@ngrx/router-store';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { markdownDocumentReducer } from './markdown-documents/markdown-document.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  markdownDocument: markdownDocumentReducer,
  router: routerReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
