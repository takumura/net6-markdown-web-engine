import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ColorCheckComponent } from './color-check.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ColorCheckComponent,
    title: 'Color Check',
  },
];

@NgModule({
  declarations: [ColorCheckComponent],
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule.forChild(routes)],
})
export class ColorCheckModule {}
