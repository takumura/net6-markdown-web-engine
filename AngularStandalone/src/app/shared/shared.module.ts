import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { MaterialModule } from './material.module';
import { TagComponent } from './tag/tag.component';
import { DocumentListItemComponent } from './document-list-item/document-list-item.component';
import { DocumentComponent } from './document/document.component';

@NgModule({
  declarations: [LoadingBarComponent, TagComponent, DocumentListItemComponent, DocumentComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [LoadingBarComponent, TagComponent, DocumentListItemComponent, DocumentComponent],
  providers: [LoadingBarService],
})
export class SharedModule {}
