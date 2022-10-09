import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, TitleStrategy } from '@angular/router';

import { MaterialModule } from './material.module';
import { DocumentComponent } from './components/markdown/document/document.component';
import { DocumentHeaderComponent } from './components/markdown/document-header/document-header.component';
import { DocumentListComponent } from './components/lists/document-list/document-list.component';
import { DocumentListItemComponent } from './components/lists/document-list-item/document-list-item.component';
import { ExpansionDocumentListComponent } from './components/lists/expansion-document-list/expansion-document-list.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { BreakpointObserverService } from './services/breakpoint-observer.service';
import { MyTitleStrategyService } from './services/markdown-document-title-strategy.service';
import { TagComponent } from './components/tags/tag/tag.component';
import { TagListComponent } from './components/tags/tag-list/tag-list.component';
import { DocumentTocComponent } from './components/markdown/document-toc/document-toc.component';
import { ScrollSpyService } from './services/scroll-spy.service';
import { TocService } from './services/toc.service';

const components = [
  DocumentComponent,
  DocumentHeaderComponent,
  DocumentListComponent,
  DocumentListItemComponent,
  DocumentTocComponent,
  ExpansionDocumentListComponent,
  LoadingBarComponent,
  TagComponent,
  TagListComponent,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [components],
  providers: [
    BreakpointObserverService,
    { provide: TitleStrategy, useClass: MyTitleStrategyService },
    ScrollSpyService,
    TocService,
  ],
})
export class SharedModule {}
