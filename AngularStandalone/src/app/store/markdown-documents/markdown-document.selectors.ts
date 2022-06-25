import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MarkdownDocumentState } from './markdown-document.reducer';
import { selectUrl } from '../router/router.selector';
import {unified} from 'unified';
import markdown from 'remark-parse';
import remarkRehype from 'remark-rehype';
import raw from 'rehype-raw';
import slug from 'rehype-slug';
import autoLinkHeadings from 'rehype-autolink-headings';
// import highlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAttrs from 'rehype-attr';

export const selectMarkdownDocumentState =
  createFeatureSelector<MarkdownDocumentState>("markdownDocument");

export const selectDocuments = createSelector(
  selectMarkdownDocumentState,
  (state) => state?.documentIndex
);

export const selectTags = createSelector(
  selectMarkdownDocumentState,
  (state) => {
    const docTags = state?.documentIndex.map((x) => {
      const content = x.content;
      return content.tag;
    });
    const tags = docTags.reduce((acc, curr) => acc.concat(curr), []);

    const result = new Set<string>(tags);
    // docs.forEach(x => result.add(x));
    return Array.from(result)
      .filter((x) => x !== undefined && x !== null)
      .sort();
  }
);

export const selectDocument = createSelector(
  selectDocuments,
  selectUrl,
  (documents, url) => {
    let defaultModel = {
      docRef: '',
      content: {
        title: '',
        date: '',
        category: '',
        tag: [],
        toc: '',
        body: '',
        bodyHtml: '',
      }
    };

    if (!url.startsWith("/doc")) {
      return defaultModel;
    }

    let document = documents?.find(x => x.docRef === url.substring(5, url.length));
    document = document ? document : defaultModel;

    const processor = unified()
      .use(markdown)
      // .use(remarkAttr)
      .use(remarkRehype, {allowDangerousHtml: true})
      .use(raw)
      .use(slug)
      .use(autoLinkHeadings)
      .use(rehypeExternalLinks, {target: '_blank', rel: ['noopener']})
      .use(rehypeAttrs, { properties: 'attr' })
      // .use(highlight)
      .use(rehypeStringify);
    const html = String(processor.processSync(document.content.body));

    const result = {
      docRef: document.docRef,
      content: {...document.content, bodyHtml: html}
    }

    return result;
  }
);