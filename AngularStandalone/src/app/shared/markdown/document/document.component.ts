import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import postscribe from 'postscribe';

import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { TocService } from '../../services/toc.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnInit, OnDestroy {
  @Input() document$: Observable<DocumentRef> = of();
  @ViewChild('mdContent')
  mdContentRef: ElementRef | undefined;

  documentTitle: string = '';
  safeMdContent: SafeHtml | undefined;
  private onDestroy = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private location: Location,
    private tocService: TocService
  ) {}

  ngOnInit() {
    this.document$.pipe(takeUntil(this.onDestroy)).subscribe((x) => {
      this.documentTitle = x.content.title;
      this.safeMdContent = this.sanitizer.bypassSecurityTrustHtml(x.content.bodyHtml);

      // detect change to update virtual DOM and allow to access mdContentRef
      this.cdRef.detectChanges();

      this.tocService.reset();
      if (this.mdContentRef) {
        this.tocService.genToc(this.mdContentRef.nativeElement, this.location.path());
      }

      this.showGist();
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private showGist() {
    if (this.mdContentRef) {
      const gists = this.mdContentRef.nativeElement.querySelectorAll('div.gist');
      gists.forEach((gist: HTMLDivElement) => {
        postscribe(gist, gist.innerHTML);
      });
    }
  }
}
