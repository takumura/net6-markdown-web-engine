import { createAction } from '@ngrx/store';

export enum loadingActions {
  showLoading = '[Loading] show',
  hideLoading = '[Loading] hide',
}

export const showLoading = createAction(loadingActions.showLoading);
export const hideLoading = createAction(loadingActions.hideLoading);
