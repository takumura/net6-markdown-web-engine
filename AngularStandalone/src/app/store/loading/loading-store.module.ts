import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import * as fromLoading from './loading.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(fromLoading.featureKey, fromLoading.reducer)],
})
export class LoadingStoreModule {}
