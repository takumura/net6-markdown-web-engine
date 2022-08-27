import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordion-document-list',
  templateUrl: './accordion-document-list.component.html',
  styleUrls: ['./accordion-document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionDocumentListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
