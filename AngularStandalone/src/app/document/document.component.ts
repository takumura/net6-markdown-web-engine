import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { selectDocument } from '../store/markdown-documents/markdown-document.selectors';

import { DocumentRef } from '../store/models/document-ref.model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  documentTitle: string = "";
  safeMdContent: SafeHtml | undefined;
  private documentSub: Subscription = new Subscription;
  private document$: Observable<DocumentRef> = this.store.select(selectDocument)

  constructor(private store: Store, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.documentSub = this.document$.subscribe(x => {
      this.documentTitle = x.content.title;
      this.safeMdContent = this.sanitizer.bypassSecurityTrustHtml(x.content.bodyHtml);
    });
  }

  ngOnDestroy() {
    this.documentSub?.unsubscribe();
  }
}
