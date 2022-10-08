import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { searchDocumentsByAdvancedOptions } from 'src/app/markdown-document/store/markdown-document.action';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() value = '';

  constructor(private router: Router, private store: Store) {}

  searchByTag(event: Event): void {
    event.stopPropagation();
    this.store.dispatch(searchDocumentsByAdvancedOptions({ tags: [this.value], category: '' }));
    this.router.navigate(['/search']);
  }
}
