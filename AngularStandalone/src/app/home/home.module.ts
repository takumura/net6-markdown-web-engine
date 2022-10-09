import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
