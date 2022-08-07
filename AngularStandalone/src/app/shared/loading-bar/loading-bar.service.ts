import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  loadingState: Observable<boolean>;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadingState = this.loadingSubject.asObservable();
  }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
