import { Injectable, OnDestroy } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { selectDocumentTitle } from 'src/app/markdown-document/store/markdown-document.selectors';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyTitleStrategyService extends TitleStrategy implements OnDestroy {
  private appName: string = environment.appTitle;
  private onDestroy = new Subject<void>();

  constructor(private store: Store) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      document.title = `${title} | ${this.appName}`;
    } else {
      this.store
        .select(selectDocumentTitle)
        .pipe(takeUntil(this.onDestroy))
        .subscribe((markdownDocumentTitle) => {
          document.title = markdownDocumentTitle != null ? `${markdownDocumentTitle} | ${this.appName}` : this.appName;
        });
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
