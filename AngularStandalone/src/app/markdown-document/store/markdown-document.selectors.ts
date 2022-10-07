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
import { searchResultSortBy } from 'src/app/markdown-document/search/sort-by-options.model';
import { sortByDate, sortByTitle } from 'src/app/shared/utils/ordering';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { initialMarkdownDocumentModel } from 'src/app/store/models/markdown-document.model';
import { selectUrl } from 'src/app/store/router/router.selector';
import * as fromMarkdownDocument from './markdown-document.reducer';
import { environment } from 'src/environments/environment';

const selectMarkdownDocumentState = createFeatureSelector<fromMarkdownDocument.State>(fromMarkdownDocument.featureKey);
const defaultDocRefModel: DocumentRef = {
  docRef: '',
  content: initialMarkdownDocumentModel,
};

export const selectCategories = createSelector(selectMarkdownDocumentState, (state) => {
  const docCategoires = state?.documentIndex.map((x) => x.content.category);
  const result = new Set<string>(docCategoires);
  return Array.from(result)
    .filter((x) => x !== undefined && x !== null)
    .filter((x) => !environment.ignoreListForCategory.some((c) => c === x.toLowerCase()))
    .sort(lowerCaseComparer);
});

export const selectDocuments = createSelector(selectMarkdownDocumentState, (state) => state?.documentIndex);

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

export const selectFilteredDocuments = createSelector(selectMarkdownDocumentState, (state) => {
  let filteredDocuments: DocumentRef[] = state?.documentIndex.filter(
    (x) => !environment.ignoreListForCategory.some((c) => c === x?.content?.category.toLowerCase())
  );

  if (!state.documentSearch.searchWord && !state.documentSearch.tags) {
    return getOrderedDocumentIndex(state, filteredDocuments);
  }

  // filter by search keywork
  filteredDocuments = filteredDocuments.filter(
    (x) =>
      x.content?.title.indexOf(state.documentSearch.searchWord) !== -1 ||
      x.content?.category.indexOf(state.documentSearch.searchWord) !== -1 ||
      x.content?.body.indexOf(state.documentSearch.searchWord) !== -1
  );

  // filter by category
  if (state.documentSearch.category) {
    filteredDocuments = filteredDocuments.filter((x) => x.content?.category === state.documentSearch.category);
  }

  //filter by tags
  if (state.documentSearch.tags && state.documentSearch.tags.length > 0) {
    filteredDocuments = filteredDocuments.filter((x) => {
      if (!x.content.tag || x.content.tag?.length === 0) {
        return false;
      } else {
        return state.documentSearch.tags.every((t) => x.content.tag.indexOf(t) !== -1);
      }
    });
  }

  return getOrderedDocumentIndex(state, filteredDocuments);
});

export const selectHasAdvancedOptions = createSelector(selectMarkdownDocumentState, (document) => {
  return !!document?.documentSearch?.category || document?.documentSearch?.tags?.length > 0;
});

export const selectSearchCategory = createSelector(
  selectMarkdownDocumentState,
  (state) => state?.documentSearch?.category
);

export const selectSearchTags = createSelector(selectMarkdownDocumentState, (state) => state?.documentSearch?.tags);

export const selectSearchWord = createSelector(
  selectMarkdownDocumentState,
  (state) => state?.documentSearch?.searchWord
);

export const selectTags = createSelector(selectMarkdownDocumentState, (state) => {
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

export const selectViewType = createSelector(selectMarkdownDocumentState, (state) => state?.documentSearch.viewType);

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

function getOrderedDocumentIndex(state: fromMarkdownDocument.State, documentIndex: DocumentRef[]) {
  let index = [...documentIndex];

  switch (state.documentSearch.sortBy) {
    case searchResultSortBy.dateLatest:
      return index.sort(sortByDate(true));
      break;
    case searchResultSortBy.dateOldest:
      return index.sort(sortByDate(false));
      break;
    case searchResultSortBy.aToZ:
      return index.sort(sortByTitle(false));
      break;
    case searchResultSortBy.zToA:
      return index.sort(sortByTitle(true));
      break;
    default:
      return documentIndex;
      break;
  }
}

function lowerCaseComparer(a: string, b: string) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}
