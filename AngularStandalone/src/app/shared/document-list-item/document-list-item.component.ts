import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DocumentRef } from 'src/app/store/document-ref.model';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListItemComponent {
  @Input() item: DocumentRef = {
    docRef: '',
    content: {
      title: '',
      date: '',
      category: '',
      tag: [],
      toc: '',
      body: '',
      bodyHtml: '',
    },
  };
  @Input() showCategory: boolean = true;

  documentRef: string = `/docs/${this.item?.docRef}`;

  constructor() {}

  // ngOnInit(): void {}
}
