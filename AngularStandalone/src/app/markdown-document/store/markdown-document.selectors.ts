import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Index } from 'lunr';
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
import { searchResultSortBy } from 'src/app/markdown-document/search/sort-by-options.model';
import { sortByDate, sortByTitle } from 'src/app/shared/utils/ordering';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { initialMarkdownDocumentModel } from 'src/app/store/models/markdown-document.model';
import { selectUrl } from 'src/app/store/router/router.selector';
import * as fromMarkdownDocument from './markdown-document.reducer';

const selectMarkdownDocumentState = createFeatureSelector<fromMarkdownDocument.State>(fromMarkdownDocument.featureKey);

export const selectSearchWord = createSelector(
  selectMarkdownDocumentState,
  (state) => state?.documentSearch?.searchWord
);

export const selectSearchTag = createSelector(selectMarkdownDocumentState, (state) => state?.documentSearch?.tag);

export const selectSearchedDocuments = createSelector(selectMarkdownDocumentState, (state) => {
  if (!state.documentSearch.searchWord && !state.documentSearch.tag) {
    return getOrderedDocumentIndex(state, state?.documentIndex);
  }

  const index: Index.Result[] = fromMarkdownDocument.lunrIndex.search(state.documentSearch.searchWord);
  if (index) {
    const refs = index.map((x) => x.ref);
    const filteredDocuments = refs.flatMap((x) => state?.documentIndex.filter((doc) => doc.docRef === x));
    return getOrderedDocumentIndex(state, filteredDocuments);
  } else {
    return getOrderedDocumentIndex(state, state?.documentIndex);
  }
});

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

export const selectDocuments = createSelector(selectMarkdownDocumentState, (state) => state?.documentIndex);

export const selectViewType = createSelector(selectMarkdownDocumentState, (state) => state?.documentSearch.viewType);

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
