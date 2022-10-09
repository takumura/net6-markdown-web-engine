import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    title: 'Search',
  },
];

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, SharedModule, RouterModule.forChild(routes)],
})
export class MarkdownDocumentSearchModule {}
