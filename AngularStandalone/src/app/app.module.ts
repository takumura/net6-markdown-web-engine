import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MarkdownDocumentModule } from './markdown-document/markdown-document.module';
import { NavComponent } from './nav/nav.component';
import { NetCoreApiComponent } from './net-core-api/net-core-api.component';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { reducers } from './store';
import { LoadingStoreModule } from './store/loading/loading-store.module';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, HomeComponent, NetCoreApiComponent, NavComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    MarkdownDocumentModule,
    // Instrumentation must be imported after importing StoreModule (config is optional)
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states
          logOnly: environment.production, // Restrict extension to log-only mode
          autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        })
      : [],
    StoreModule.forRoot(reducers),
    LoadingStoreModule,
    AppRoutingModule,
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
