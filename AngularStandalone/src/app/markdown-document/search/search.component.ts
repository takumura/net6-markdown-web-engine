import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  Subject,
  BehaviorSubject,
  takeUntil,
  startWith,
  map,
  switchMap,
  combineLatestWith,
} from 'rxjs';

import { searchResultSortBy, sortByOption } from './sort-by-options.model';
import { searchResultViewType } from './view-type-options.model';
import {
  loadDocuments,
  searchDocuments,
  searchDocumentsByAdvancedOptions,
  updateViewType,
} from '../store/markdown-document.action';
import {
  selectCategories,
  selectFilteredDocuments,
  selectHasAdvancedOptions,
  selectSearchCategory,
  selectSearchTags,
  selectSearchWord,
  selectTags,
  selectViewType,
} from '../store/markdown-document.selectors';
import { DocumentRef } from '../../store/models/document-ref.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  searchForm = new FormGroup({
    searchInputForm: new FormControl(''),
    searchOptionForm: new FormControl(searchResultSortBy.dateLatest),
    searchCategoryForm: new FormControl(''),
    searchTagForm: new FormControl(''),
  });

  category: string = '';
  isAdvancedSearchOpen: boolean = false;
  // used for tag autocomplete separator key
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  viewTypeModel = searchResultViewType;

  documents$!: Observable<DocumentRef[]>;
  allCategories$!: Observable<string[]>;
  allTags$!: Observable<string[]>;
  filteredTags$!: Observable<string[]>;
  hasAdvancedOptions$!: Observable<boolean>;
  sortByOptionsSub!: BehaviorSubject<sortByOption[]>;
  sortByOptions$!: Observable<sortByOption[]>;
  viewType$!: Observable<number>;

  private currentViewType: number = 0;
  private onDestroy = new Subject<void>();
  private sortByOptions: sortByOption[] = [
    { key: searchResultSortBy.dateLatest, value: 'by date (latest)' },
    { key: searchResultSortBy.dateOldest, value: 'by date (oldest)' },
  ];
  //TODO reuser array to DRY
  private sortByAfterSearchOptions: sortByOption[] = [
    { key: searchResultSortBy.dateLatest, value: 'by date (latest)' },
    { key: searchResultSortBy.dateOldest, value: 'by date (oldest)' },
    { key: searchResultSortBy.hitIndex, value: 'by hit index' },
  ];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.documents$ = this.store.select(selectFilteredDocuments);

    this.allCategories$ = this.store.select(selectCategories);
    this.allTags$ = this.store.select(selectTags);
    this.hasAdvancedOptions$ = this.store.select(selectHasAdvancedOptions);
    this.sortByOptionsSub = new BehaviorSubject<sortByOption[]>(this.sortByOptions);
    this.sortByOptions$ = this.sortByOptionsSub.asObservable();
    this.viewType$ = this.store.select(selectViewType);

    this.filteredTags$ = this.searchForm.controls.searchTagForm.valueChanges.pipe(
      startWith(null),
      switchMap((tag: string | null) => (tag ? this.getAutocompleteTags(tag) : this.getAvailableTags()))
    );

    this.searchForm.controls.searchOptionForm.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((_) => {
      this.searchDocumentInternal();
    });

    this.searchForm?.controls?.searchInputForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.onDestroy))
      .subscribe((_) => {
        this.searchDocumentInternal();
      });

    this.store
      .select(selectSearchWord)
      .pipe(combineLatestWith(this.store.select(selectSearchCategory)), takeUntil(this.onDestroy))
      .subscribe(([searchWord, searchCategory]) => {
        this.searchForm.patchValue({
          searchInputForm: searchWord,
          searchCategoryForm: searchCategory,
        });
      });

    this.store
      .select(selectSearchTags)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((tags) => {
        this.tags = [...tags];
      });

    this.viewType$.pipe(takeUntil(this.onDestroy)).subscribe((x) => {
      this.currentViewType = x;
    });

    this.store.dispatch(loadDocuments());
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) this.tags.push(value);

    // Clear the input value
    event.chipInput!.clear();
    this.searchForm.patchValue({ searchTagForm: '' });
  }

  advancedSearch(): void {
    this.store.dispatch(searchDocumentsByAdvancedOptions({ tags: [...this.tags], category: this.category }));

    this.searchDocumentInternal();
    this.toggleAdvancedSearchOpen();
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    this.category = event.option.viewValue;
  }

  clearAdvancedSearchOptions() {
    this.store.dispatch(searchDocumentsByAdvancedOptions({ tags: [], category: '' }));
    this.searchForm.patchValue({ searchTagForm: '' });
    this.tags.splice(0);

    this.searchDocumentInternal();
    this.toggleAdvancedSearchOpen();
  }

  clearSearchInput(): void {
    this.searchForm.patchValue({ searchInputForm: '', searchOptionForm: searchResultSortBy.dateLatest });
  }

  tagRemove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.searchForm.patchValue({ searchTagForm: '' });
  }

  toggleAdvancedSearchOpen(): void {
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;
  }

  updateViewType(viewType: number): void {
    if (this.currentViewType !== viewType) {
      this.store.dispatch(updateViewType({ viewType: viewType }));
    }
  }

  private getAutocompleteTags(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();

    return this.allTags$.pipe(map((tags) => tags.filter((x) => x.toLowerCase().includes(filterValue))));
  }

  private getAvailableTags(): Observable<string[]> {
    return this.allTags$.pipe(
      map((tags) => {
        return tags.filter((x) => !this.tags.includes(x.toLowerCase()));
      })
    );
  }

  private searchDocumentInternal(): void {
    const searchWord = this.searchForm.controls.searchInputForm.value ?? '';
    const sortByValue = this.searchForm.controls.searchOptionForm.value ?? 0;

    this.store.dispatch(searchDocuments({ search: searchWord, sortBy: sortByValue }));
    this.documents$ = this.store.select(selectFilteredDocuments);
    if (searchWord) {
      this.sortByOptionsSub.next(this.sortByAfterSearchOptions);
    } else {
      this.sortByOptionsSub.next(this.sortByOptions);
    }
  }
}
