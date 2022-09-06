import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointObserverService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  getSmallBreakpoint() {
    return this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((result) => result.matches));
  }

  getMediumBreakpoint() {
    return this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .pipe(map((result) => result.matches));
  }
}
