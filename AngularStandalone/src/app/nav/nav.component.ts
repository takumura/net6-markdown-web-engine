import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { delay, filter, Observable, Subject, takeUntil } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LoadingBarService } from '../shared/loading-bar/loading-bar.service';
import { BreakpointObserverService } from '../shared/services/breakpoint-observer.service';

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
    private loadingBarService: LoadingBarService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => {
        this.loadingBarService.show();
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
        this.loadingBarService.hide();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
