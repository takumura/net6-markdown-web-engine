import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DocumentRef } from '../store/models/document-ref.model';
import { reload } from '../store/markdown-documents/markdown-document.action';
import {
  selectDocuments,
  selectTags,
} from '../store/markdown-documents/markdown-document.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  documents$: Observable<DocumentRef[]> = this.store.select(selectDocuments);
  tags$: Observable<string[]> = this.store.select(selectTags);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(reload());
  }
}
