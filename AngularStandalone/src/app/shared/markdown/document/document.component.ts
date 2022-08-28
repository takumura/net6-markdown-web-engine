import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { selectDocument } from 'src/app/markdown-document/store/markdown-document.selectors';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import postscribe from 'postscribe';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnInit, OnDestroy {
  @ViewChild('mdContent')
  mdContentRef: ElementRef | undefined;

  documentTitle: string = '';
  safeMdContent: SafeHtml | undefined;
  private document$: Observable<DocumentRef> = this.store.select(selectDocument);
  private onDestroy = new Subject<void>();

  constructor(private store: Store, private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.document$.pipe(takeUntil(this.onDestroy)).subscribe((x) => {
      this.documentTitle = x.content.title;
      this.safeMdContent = this.sanitizer.bypassSecurityTrustHtml(x.content.bodyHtml);

      // detect change to update virtual DOM and allow to access mdContentRef
      this.cdRef.detectChanges();

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
