import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NetCoreApiComponent } from './net-core-api/net-core-api.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'test-api', component: NetCoreApiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
