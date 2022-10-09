import { createFeatureSelector, createSelector } from '@ngrx/store';

import { unified } from 'unified';
import { refractor } from 'refractor/lib/core.js';
import csharp from 'refractor/lang/csharp.js';
import css from 'refractor/lang/css.js';
import diff from 'refractor/lang/diff.js';
import markup from 'refractor/lang/markup.js';
import javascript from 'refractor/lang/javascript.js';
import json from 'refractor/lang/json.js';
import powershell from 'refractor/lang/powershell.js';
import typescript from 'refractor/lang/typescript.js';
import yaml from 'refractor/lang/yaml.js';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAttrs from 'rehype-attr';
import rehypePrismGenerator from 'rehype-prism-plus/generator';
import * as fromDocumentIndex from './document-index.reducer';
import { environment } from 'src/environments/environment';
import { selectUrl } from '../router/router.selectors';
import { DocumentRef } from '../models/document-ref.model';
import { initialMarkdownDocumentModel } from '../models/markdown-document.model';
import { lowerCaseComparer } from 'src/app/shared/utils/lowerCaseComparer';

const selectDocumentIndexState = createFeatureSelector<fromDocumentIndex.State>(fromDocumentIndex.featureKey);

const defaultDocRefModel: DocumentRef = {
  docRef: '',
  content: initialMarkdownDocumentModel,
};

export const selectCategories = createSelector(selectDocumentIndexState, (state) => {
  const docCategoires = state?.documentIndex.map((x) => x.content.category);
  const result = new Set<string>(docCategoires);
  return Array.from(result)
    .filter((x) => x !== undefined && x !== null)
    .filter((x) => !environment.ignoreListForCategory.some((c) => c === x.toLowerCase()))
    .sort(lowerCaseComparer);
});

export const selectDocuments = createSelector(selectDocumentIndexState, (state) => state?.documentIndex);

export const selectDocument = createSelector(selectDocuments, selectUrl, (documents, url) => {
  // The fragment will be included on url e.g. click ToC link
  // It is not required on this selecotr process, so drop off fragment value
  // The fragment information will be used on display component via "selectFragment" route selector
  const urlPath: string = url.replace(/#.*/, '');

  if (!urlPath.startsWith('/doc')) {
    return defaultDocRefModel;
  }

  const document = documents?.find((x) => x.docRef === urlPath.substring(5, urlPath.length)) ?? defaultDocRefModel;
  return convertJsonToHtml(document);
});

export const selectDocumentByDocRef = (docRef: string) =>
  createSelector(selectDocuments, selectUrl, (documents, url) => {
    let document = documents?.find((x) => x.docRef === docRef) ?? defaultDocRefModel;
    return convertJsonToHtml(document);
  });

export const selectDocumentTitle = createSelector(selectDocument, (document) => {
  return document?.content?.title;
});

export const selectTags = createSelector(selectDocumentIndexState, (state) => {
  const docTags = state?.documentIndex.map((x) => {
    const content = x.content;
    return content.tag;
  });
  const tags = docTags.reduce((acc, curr) => acc.concat(curr), []);

  const result = new Set<string>(tags);
  return Array.from(result)
    .filter((x) => x !== undefined && x !== null)
    .sort(lowerCaseComparer);
});

function convertJsonToHtml(document: DocumentRef) {
  refractor.register(csharp);
  refractor.register(css);
  refractor.register(diff);
  refractor.register(markup);
  refractor.register(javascript);
  refractor.register(json);
  refractor.register(powershell);
  refractor.register(typescript);
  refractor.register(yaml);
  const myPrismPlugin = rehypePrismGenerator(refractor);

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'] })
    .use(rehypeAttrs, { properties: 'attr' })
    .use(myPrismPlugin, { showLineNumbers: true })
    .use(rehypeStringify);
  const html = String(processor.processSync(document.content.body));

  const result = {
    docRef: document.docRef,
    content: { ...document.content, bodyHtml: html },
  };

  return result;
}
