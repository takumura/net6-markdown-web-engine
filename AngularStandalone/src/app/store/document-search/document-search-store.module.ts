import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import * as fromDocumentSearch from './document-search.reducer';
import { DocumentSearchEffects } from './document-search.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromDocumentSearch.featureKey, fromDocumentSearch.reducer),
    EffectsModule.forFeature([DocumentSearchEffects]),
  ],
})
export class DocumentSearchStoreModule {}
