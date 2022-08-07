import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { initialMarkdownDocumentModel } from 'src/app/store/models/markdown-document.model';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListItemComponent implements OnInit {
  @Input() item: DocumentRef = {
    docRef: '',
    content: initialMarkdownDocumentModel,
  };
  @Input() showCategory: boolean = true;

  documentRef: string = '/doc';

  ngOnInit(): void {
    this.documentRef = `/doc/${this.item?.docRef}`;
  }
}
