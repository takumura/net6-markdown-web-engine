import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { ScrollSpyInfo, ScrollSpyService } from './scroll-spy.service';

// Brought from aio repository, customized for using NGRX
// https://github.com/angular/angular/blob/main/aio/src/app/shared/toc.service.ts

export interface TocItem {
  href: string;
  fragment: string;
  level: string;
  title: string;
}

@Injectable()
export class TocService {
  tocList = new ReplaySubject<TocItem[]>(1);
  activeItemIndex = new ReplaySubject<number | null>(1);
  private scrollSpyInfo: ScrollSpyInfo | null = null;

  constructor(@Inject(DOCUMENT) private document: any, private scrollSpyService: ScrollSpyService) {}

  genToc(docElement?: Element, docId = '') {
    this.resetScrollSpyInfo();

    if (!docElement) {
      this.tocList.next([]);
      return;
    }

    const headings = this.findTocHeadings(docElement);
    const idMap = new Map<string, number>();
    const tocList = headings.map((heading) => {
      return {
        level: heading.tagName.toLowerCase(),
        href: docId,
        title: (heading.textContent || '').trim(),
        fragment: this.getId(heading, idMap),
      } as TocItem;
    });

    this.tocList.next(tocList);

    this.scrollSpyInfo = this.scrollSpyService.spyOn(headings);
    this.scrollSpyInfo.active.subscribe((item) => this.activeItemIndex.next(item && item.index));
  }

  reset() {
    this.resetScrollSpyInfo();
    this.tocList.next([]);
  }

  private findTocHeadings(docElement: Element): HTMLHeadingElement[] {
    const headings = docElement.querySelectorAll<HTMLHeadingElement>('h1,h2,h3');
    const skipNoTocHeadings = (heading: HTMLHeadingElement) => !/(?:no-toc|notoc)/i.test(heading.className);

    return Array.prototype.filter.call(headings, skipNoTocHeadings);
  }

  private resetScrollSpyInfo() {
    if (this.scrollSpyInfo) {
      this.scrollSpyInfo.unspy();
      this.scrollSpyInfo = null;
    }

    this.activeItemIndex.next(null);
  }

  // Extract the id from the heading; create one if necessary
  // Is it possible for a heading to lack an id?
  private getId(h: HTMLHeadingElement, idMap: Map<string, number>) {
    let id = h.id;
    if (id) {
      addToMap(id);
    } else {
      id = (h.textContent || '').trim().toLowerCase().replace(/\W+/g, '-');
      id = addToMap(id);
      h.id = id;
    }
    return id;

    // Map guards against duplicate id creation.
    function addToMap(key: string) {
      const oldCount = idMap.get(key) || 0;
      const count = oldCount + 1;
      idMap.set(key, count);
      return count === 1 ? key : `${key}-${count}`;
    }
  }
}
