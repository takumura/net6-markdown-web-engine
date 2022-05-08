import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DocumentRef } from '../store/document-ref.model';
import { reload } from '../store/markdown-document.action';
import { selectDocuments } from '../store/markdown-document.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  documents$: Observable<DocumentRef[]> = this.store.select(selectDocuments);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(reload());
  }
}
