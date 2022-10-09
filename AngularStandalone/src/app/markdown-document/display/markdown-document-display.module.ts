import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DisplayComponent } from './display.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '**',
        component: DisplayComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [DisplayComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, SharedModule, RouterModule.forChild(routes)],
})
export class MarkdownDocumentDisplayModule {}
