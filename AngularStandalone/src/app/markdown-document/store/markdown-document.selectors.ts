import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromMarkdownDocument from './markdown-document.reducer';
import { selectUrl } from '../../store/router/router.selector';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAttrs from 'rehype-attr';
import rehypePrismPlus from 'rehype-prism-plus';
import { initialMarkdownDocumentModel } from 'src/app/store/models/markdown-document.model';

const selectMarkdownDocumentState = createFeatureSelector<fromMarkdownDocument.State>(fromMarkdownDocument.featureKey);

export const selectDocuments = createSelector(selectMarkdownDocumentState, (state) => state?.documentIndex);

export const selectTags = createSelector(selectMarkdownDocumentState, (state) => {
  const docTags = state?.documentIndex.map((x) => {
    const content = x.content;
    return content.tag;
  });
  const tags = docTags.reduce((acc, curr) => acc.concat(curr), []);

  const result = new Set<string>(tags);
  return Array.from(result)
    .filter((x) => x !== undefined && x !== null)
    .sort();
});

export const selectDocument = createSelector(selectDocuments, selectUrl, (documents, url) => {
  let defaultModel = {
    docRef: '',
    content: initialMarkdownDocumentModel,
  };

  if (!url.startsWith('/doc')) {
    return defaultModel;
  }

  let document = documents?.find((x) => x.docRef === url.substring(5, url.length)) ?? defaultModel;

  // TODO: only import required language for highlight if those make vendor.js file so big
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'] })
    .use(rehypeAttrs, { properties: 'attr' })
    .use(rehypePrismPlus, { showLineNumbers: true })
    .use(rehypeStringify);
  const html = String(processor.processSync(document.content.body));

  const result = {
    docRef: document.docRef,
    content: { ...document.content, bodyHtml: html },
  };

  return result;
});

export const selectDocumentTitle = createSelector(selectDocument, (document) => {
  return document?.content?.title;
});
