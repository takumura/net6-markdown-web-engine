import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { DisplayComponent } from './display/display.component';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import * as fromMarkdownDocument from './store/markdown-document.reducer';

@NgModule({
  declarations: [SearchComponent, DisplayComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    StoreModule.forFeature(fromMarkdownDocument.featureKey, fromMarkdownDocument.reducer),
  ],
})
export class MarkdownDocumentModule {}
