import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';
import { TocItem } from './toc-item.model';

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTocComponent implements OnInit {
  @Input() document: MarkdownDocument | undefined = initialMarkdownDocumentModel;
  tocList: TocItem[] = [];

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.generateToc();
  }

  private generateToc() {
    if (this.document && this.document.toc !== 'none') {
      const href = this.location.path();
      const headings = this.findTocHeadings(this.document.toc);
      if (headings) {
        this.tocList = headings.map((heading) => ({
          href: href,
          fragment: heading.id,
          level: heading.tagName.toLowerCase(),
          title: (heading.textContent || '').trim(),
        }));
      }
    }
  }

  private findTocHeadings(toc: string): HTMLHeadingElement[] | null {
    const tocHeader = toc ?? 'h2,h3';

    if (this.document) {
      const tmpDiv = document.createElement('div');
      tmpDiv.innerHTML = this.document.bodyHtml;

      const headings = tmpDiv.querySelectorAll(tocHeader);
      const skipNoTocHeadings = (heading: HTMLHeadingElement) => !/(?:no-toc|notoc)/i.test(heading.className);
      return Array.prototype.filter.call(headings, skipNoTocHeadings);
    } else {
      return null;
    }
  }
}
