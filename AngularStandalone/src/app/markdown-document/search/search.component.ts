import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, debounceTime, distinctUntilChanged, Subject, BehaviorSubject, takeUntil } from 'rxjs';

import { searchResultSortBy, sortByOption } from './sort-by-options.interface';
import { searchResultViewType } from './view-type-options';
import { loadDocuments, searchDocuments, updateViewType } from '../store/markdown-document.action';
import {
  selectSearchedDocuments,
  selectSearchWord,
  selectTags,
  selectViewType,
} from '../store/markdown-document.selectors';
import { DocumentRef } from '../../store/models/document-ref.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  searchInputForm = new FormControl('');
  searchOptionForm = new FormControl(searchResultSortBy.dateLatest);
  private sortByOptions: sortByOption[] = [
    { key: searchResultSortBy.dateLatest, value: 'by date (latest)' },
    { key: searchResultSortBy.dateOldest, value: 'by date (oldest)' },
  ];
  private sortByAfterSearchOptions: sortByOption[] = [
    { key: searchResultSortBy.dateLatest, value: 'by date (latest)' },
    { key: searchResultSortBy.dateOldest, value: 'by date (oldest)' },
    { key: searchResultSortBy.hitIndex, value: 'by hit index' },
  ];
  sortByOptionsSub = new BehaviorSubject<sortByOption[]>(this.sortByOptions);
  viewType = searchResultViewType;

  documents$: Observable<DocumentRef[]> = this.store.select(selectSearchedDocuments);
  sortByOptions$: Observable<sortByOption[]> = this.sortByOptionsSub.asObservable();
  tags$: Observable<string[]> = this.store.select(selectTags);
  viewType$: Observable<number> = this.store.select(selectViewType);
  private onDestroy = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectSearchWord)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((searchWord) => {
        this.searchInputForm.setValue(searchWord);
      });

    this.store.dispatch(loadDocuments());

    this.searchOptionForm.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((_) => {
      this.searchDocumentInternal();
    });
    this.searchInputForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.onDestroy))
      .subscribe((_) => {
        this.searchDocumentInternal();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  clearSearchInput() {
    this.searchInputForm.setValue('');
    this.searchOptionForm.setValue(searchResultSortBy.dateLatest);
  }

  updateViewType(viewType: number) {
    this.store.dispatch(updateViewType({ viewType: viewType }));
  }

  private searchDocumentInternal() {
    const searchWord = this.searchInputForm.value ?? '';
    const sortByValue = this.searchOptionForm.value ?? 0;

    this.store.dispatch(searchDocuments({ search: searchWord, sortBy: sortByValue }));
    this.documents$ = this.store.select(selectSearchedDocuments);
    if (searchWord) {
      this.sortByOptionsSub.next(this.sortByAfterSearchOptions);
    } else {
      this.sortByOptionsSub.next(this.sortByOptions);
    }
  }
}
