import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, TitleStrategy } from '@angular/router';

import { MaterialModule } from './material.module';
import { DocumentComponent } from './markdown/document/document.component';
import { DocumentHeaderComponent } from './markdown/document-header/document-header.component';
import { DocumentListComponent } from './lists/document-list/document-list.component';
import { DocumentListItemComponent } from './lists/document-list-item/document-list-item.component';
import { ExpansionDocumentListComponent } from './lists/expansion-document-list/expansion-document-list.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { BreakpointObserverService } from './services/breakpoint-observer.service';
import { MyTitleStrategyService } from './services/markdown-document-title-strategy.service';
import { TagComponent } from './tags/tag/tag.component';
import { TagListComponent } from './tags/tag-list/tag-list.component';

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentListComponent,
    DocumentListItemComponent,
    ExpansionDocumentListComponent,
    LoadingBarComponent,
    TagComponent,
    TagListComponent,
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentListComponent,
    DocumentListItemComponent,
    ExpansionDocumentListComponent,
    LoadingBarComponent,
    TagComponent,
    TagListComponent,
  ],
  providers: [
    BreakpointObserverService,
    LoadingBarService,
    { provide: TitleStrategy, useClass: MyTitleStrategyService },
  ],
})
export class SharedModule {}
