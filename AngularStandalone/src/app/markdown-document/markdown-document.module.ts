import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DisplayComponent } from './display/display.component';
import { SearchComponent } from './search/search.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SearchComponent, DisplayComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, SharedModule],
})
export class MarkdownDocumentModule {}
