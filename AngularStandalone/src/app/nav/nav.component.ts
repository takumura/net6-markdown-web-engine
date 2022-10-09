import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, filter, Observable, Subject, takeUntil } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BreakpointObserverService } from 'src/app/shared/services/breakpoint-observer.service';
import { hideLoading, showLoading } from 'src/app/store/loading/loading.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit, OnDestroy {
  env = environment;
  isSmall$: Observable<boolean> = this.breakpointObserverService.getSmallBreakpoint();
  private onDestroy = new Subject<void>();

  constructor(
    private breakpointObserverService: BreakpointObserverService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => {
        this.store.dispatch(showLoading());
      });

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError
        ),
        delay(1000),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => {
        this.store.dispatch(hideLoading());
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
