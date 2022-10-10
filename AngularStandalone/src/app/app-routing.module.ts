import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NetCoreApiComponent } from './net-core-api/net-core-api.component';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  {
    path: 'search',
    loadChildren: () =>
      import('./markdown-document/search/markdown-document-search.module').then((m) => m.MarkdownDocumentSearchModule),
  },
  {
    path: 'doc/:ref',
    loadChildren: () =>
      import('./markdown-document/display/markdown-document-display.module').then(
        (m) => m.MarkdownDocumentDisplayModule
      ),
  },
  {
    path: 'color-check',
    loadChildren: () => import('./color-check/color-check.module').then((m) => m.ColorCheckModule),
  },
  { path: 'test-api', component: NetCoreApiComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
