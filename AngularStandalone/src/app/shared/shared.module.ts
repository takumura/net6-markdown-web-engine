import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [LoadingBarComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoadingBarComponent],
  providers: [LoadingBarService],
})
export class SharedModule {}
