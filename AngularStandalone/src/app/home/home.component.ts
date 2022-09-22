import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { selectDocumentByDocRef } from '../markdown-document/store/markdown-document.selectors';
import { DocumentRef } from '../store/models/document-ref.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  env = environment;
  document$: Observable<DocumentRef> = this.store.select(selectDocumentByDocRef('welcome'));

  constructor(private store: Store) {}
}
