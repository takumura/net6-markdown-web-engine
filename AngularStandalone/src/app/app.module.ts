import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { NetCoreApiComponent } from './net-core-api/net-core-api.component';
import { AppRoutingModule } from './app-routing.module';
import { DocumentIndexStoreModule } from './store/document-index/document-index-store.module';
import { DocumentSearchStoreModule } from './store/document-search/document-search-store.module';
import { LoadingStoreModule } from './store/loading/loading-store.module';
import { MarkdownDocumentModule } from './markdown-document/markdown-document.module';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { reducers } from './store';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, HomeComponent, NetCoreApiComponent, NavComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    MarkdownDocumentModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(),
    DocumentIndexStoreModule,
    DocumentSearchStoreModule,
    LoadingStoreModule,
    AppRoutingModule,
    StoreRouterConnectingModule.forRoot(),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states
          logOnly: environment.production, // Restrict extension to log-only mode
          autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        })
      : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
