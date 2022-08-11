import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { delay, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { LoadingBarService } from '../shared/loading-bar/loading-bar.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit, OnDestroy {
  isSmall$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((result) => result.matches));
  env = environment;
  private onDestroy = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
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
