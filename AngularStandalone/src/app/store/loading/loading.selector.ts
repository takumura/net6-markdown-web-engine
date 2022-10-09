import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromLoading from './loading.reducer';

const selectLoadingState = createFeatureSelector<fromLoading.State>(fromLoading.featureKey);

export const selectShowLoading = createSelector(selectLoadingState, (state) => state?.loading);
