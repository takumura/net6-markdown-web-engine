import { Injectable, OnDestroy } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectDocumentTitle } from 'src/app/markdown-document/store/markdown-document.selectors';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyTitleStrategyService extends TitleStrategy implements OnDestroy {
  private appName: string = environment.appTitle;
  private destroySub: Subscription = new Subscription();

  constructor(private store: Store) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      document.title = `${title} | ${this.appName}`;
    } else {
      this.destroySub = this.store.select(selectDocumentTitle).subscribe((markdownDocumentTitle) => {
        document.title = markdownDocumentTitle != null ? `${markdownDocumentTitle} | ${this.appName}` : this.appName;
      });
    }
  }

  ngOnDestroy() {
    this.destroySub?.unsubscribe();
  }
}
