import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BreakpointObserverService } from 'src/app/shared/services/breakpoint-observer.service';

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
  isMedium$: Observable<boolean> = this.breakpointObserverService.getMediumBreakpoint();

  constructor(private breakpointObserverService: BreakpointObserverService, private store: Store) {}
}
