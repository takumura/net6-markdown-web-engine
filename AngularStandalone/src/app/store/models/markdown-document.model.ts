export interface MarkdownDocument {
  title: string;
  date: string;
  category: string;
  tag: string[];
  toc: string;
  body: string;
  bodyHtml: string;
}

export const initialMarkdownDocumentModel = {
  title: '',
  date: '',
  category: '',
  tag: [],
  toc: '',
  body: '',
  bodyHtml: '',
};
