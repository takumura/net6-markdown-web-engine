import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { HomeComponent } from './home/home.component';
import { NetCoreApiComponent } from './net-core-api/net-core-api.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  {
    path: 'doc/:ref', children: [
      {
        path: '**',
        component: DocumentComponent,
      },
    ],
  },
  { path: 'test-api', component: NetCoreApiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
