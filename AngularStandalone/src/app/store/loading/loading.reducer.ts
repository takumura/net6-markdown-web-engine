import { Action, createReducer, on } from '@ngrx/store';
import { hideLoading, showLoading } from './loading.action';

export const featureKey = 'loading';

export interface State {
  loading: boolean;
}

export function reducer(state: State | undefined, action: Action) {
  return loadingReducer(state, action);
}

const initialState: State = {
  loading: false,
};

const loadingReducer = createReducer(
  initialState,
  on(
    showLoading,
    (state): State => ({
      ...state,
      loading: true,
    })
  ),
  on(
    hideLoading,
    (state): State => ({
      ...state,
      loading: false,
    })
  )
);
