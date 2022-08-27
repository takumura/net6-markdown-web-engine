import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, TitleStrategy } from '@angular/router';

import { MaterialModule } from './material.module';
import { AccordionDocumentListComponent } from './lists/accordion-document-list/accordion-document-list.component';
import { DocumentComponent } from './markdown/document/document.component';
import { DocumentHeaderComponent } from './markdown/document-header/document-header.component';
import { DocumentListComponent } from './lists/document-list/document-list.component';
import { DocumentListItemComponent } from './lists/document-list/document-list-item/document-list-item.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { TagComponent } from './tags/tag/tag.component';
import { TagListComponent } from './tags/tag-list/tag-list.component';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { MyTitleStrategyService } from './services/markdown-document-title-strategy.service';

@NgModule({
  declarations: [
    AccordionDocumentListComponent,
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentListComponent,
    DocumentListItemComponent,
    LoadingBarComponent,
    TagComponent,
    TagListComponent,
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    AccordionDocumentListComponent,
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentListComponent,
    DocumentListItemComponent,
    LoadingBarComponent,
    TagComponent,
    TagListComponent,
  ],
  providers: [LoadingBarService, { provide: TitleStrategy, useClass: MyTitleStrategyService }],
})
export class SharedModule {}
