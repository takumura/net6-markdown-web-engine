import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import * as fromDocumentSearch from './document-search.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(fromDocumentSearch.featureKey, fromDocumentSearch.reducer)],
})
export class DocumentSearchStoreModule {}
