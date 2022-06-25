import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MarkdownDocumentState } from './markdown-document.reducer';
import { selectUrl } from '../router/router.selector';

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
    const defaultModel = {
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

    // TODO: need improvement
    const result = documents?.find(x => x.docRef.replace(/\\/g, '/') === url.substring(5, url.length));

    return result ? result : defaultModel
  }
);