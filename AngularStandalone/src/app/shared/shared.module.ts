import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, TitleStrategy } from '@angular/router';

import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { MaterialModule } from './material.module';
import { TagComponent } from './tag/tag.component';
import { DocumentListItemComponent } from './document-list-item/document-list-item.component';
import { DocumentComponent } from './document/document.component';
import { DocumentHeaderComponent } from './document-header/document-header.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { MyTitleStrategyService } from './services/markdown-document-title-strategy.service';

@NgModule({
  declarations: [
    LoadingBarComponent,
    TagComponent,
    DocumentListItemComponent,
    DocumentComponent,
    DocumentHeaderComponent,
    TagListComponent,
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    LoadingBarComponent,
    TagComponent,
    DocumentListItemComponent,
    DocumentComponent,
    DocumentHeaderComponent,
    TagListComponent,
  ],
  providers: [LoadingBarService, { provide: TitleStrategy, useClass: MyTitleStrategyService }],
})
export class SharedModule {}
