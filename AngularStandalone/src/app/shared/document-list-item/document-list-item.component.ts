import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DocumentRef } from 'src/app/store/models/document-ref.model';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListItemComponent implements OnInit {
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

  documentRef: string = "/doc";

  ngOnInit(): void {
    // TODO: need improvement
    this.documentRef = `/doc/${this.item?.docRef.replace(/\\/g, '/')}`;
  }
}
