import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderComponent {
  @Input() document: MarkdownDocument | undefined = initialMarkdownDocumentModel;

  constructor() {}
}
