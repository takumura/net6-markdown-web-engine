import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, Observable, of, Subject, takeUntil } from 'rxjs';

import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { CategorizedSearchResult } from './categorized-search-result.model';

@Component({
  selector: 'app-expansion-document-list',
  templateUrl: './expansion-document-list.component.html',
  styleUrls: ['./expansion-document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionDocumentListComponent implements OnInit, OnDestroy {
  @Input() documents$: Observable<DocumentRef[]> = of([]);
  categorizedSearchResult: CategorizedSearchResult[] = [];

  private onDestroy = new Subject<void>();
  constructor() {}

  ngOnInit(): void {
    this.documents$.pipe(distinctUntilChanged(), takeUntil(this.onDestroy)).subscribe((x) => {
      this.categorizedSearchResult = this.getCategorisedSearchResult(x);
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private getCategorisedSearchResult(docs: DocumentRef[]): CategorizedSearchResult[] {
    const categories = this.getCategoris(docs);

    const categoryItemList: CategorizedSearchResult[] = [];
    categories.forEach((x) => {
      const item: CategorizedSearchResult = {
        category: '',
        docs: [],
        count: 0,
      };
      item.category = x === undefined ? '[no categories]' : x;
      item.docs = docs.filter((doc) => doc.content.category == x);
      item.count = Object.keys(item.docs).length;
      categoryItemList.push(item);
    });

    return categoryItemList;
  }

  private getCategoris(docs: DocumentRef[]): string[] {
    return docs
      .map((doc) => doc.content.category)
      .filter((x, i, self) => self.indexOf(x) === i)
      .sort(this.sortBy());
  }

  private sortBy() {
    return (a: string, b: string) => {
      // refer to following site:
      // https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-in-javascript
      const comparison = a.toLowerCase().localeCompare(b.toLowerCase());
      /* If strings are equal in case insensitive comparison */
      if (comparison === 0) {
        /* Return case sensitive comparison instead */
        return a.localeCompare(b);
      }
      /* Otherwise return result */
      return comparison;
    };
  }
}
