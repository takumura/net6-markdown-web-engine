import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { selectDocument } from '../store/markdown-document.selectors';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent {
  document$: Observable<DocumentRef> = this.store.select(selectDocument);

  constructor(private store: Store) {}
}
