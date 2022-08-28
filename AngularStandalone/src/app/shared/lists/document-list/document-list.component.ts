import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DocumentRef } from 'src/app/store/models/document-ref.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  @Input() documents: DocumentRef[] | null = [];

  constructor() {}
}
