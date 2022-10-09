import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import * as fromDocumentIndex from './document-index.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(fromDocumentIndex.featureKey, fromDocumentIndex.reducer)],
})
export class DocumentIndexStoreModule {}
