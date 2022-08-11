import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NetCoreApiComponent } from './net-core-api/net-core-api.component';
import { SearchComponent } from './markdown-document/search/search.component';
import { DisplayComponent } from './markdown-document/display/display.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'search', component: SearchComponent, title: 'Search' },
  {
    path: 'doc/:ref',
    children: [
      {
        path: '**',
        component: DisplayComponent,
      },
    ],
  },
  { path: 'test-api', component: NetCoreApiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
