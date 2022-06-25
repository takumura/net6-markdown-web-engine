import { MarkdownDocument } from './markdown-document.model';

export interface DocumentRef {
  docRef: string;
  content: MarkdownDocument;
}
