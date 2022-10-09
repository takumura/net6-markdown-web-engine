import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, delay } from 'rxjs';

import { documentSearchActions } from './document-search.actions';
import { hideLoading } from '../loading/loading.actions';

@Injectable()
export class DocumentSearchEffects {
  documentSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(documentSearchActions.searchDocuments, documentSearchActions.searchDocumentsByAdvancedOptions),
      delay(1000),
      map((_) => hideLoading())
    )
  );

  constructor(private actions$: Actions) {}
}
