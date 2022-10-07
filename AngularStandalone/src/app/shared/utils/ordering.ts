import { DocumentRef } from 'src/app/store/models/document-ref.model';

export function sortByTitle(desc: boolean) {
  return (a: DocumentRef, b: DocumentRef) => {
    const aTitle = a.content.title.toLowerCase();
    const bTitle = b.content.title.toLowerCase();
    let result = 0;

    if (aTitle > bTitle) {
      result = 1;
    } else if (aTitle < bTitle) {
      result = -1;
    }

    return desc ? result * -1 : result;
  };
}

export function sortByDate(desc: boolean) {
  return (a: DocumentRef, b: DocumentRef) => {
    const aDate = a.content.date;
    const bDate = b.content.date;
    let result = 0;
    if (!aDate && !bDate) {
      result = 0;
    } else if (!aDate) {
      result = -1;
    } else if (!bDate) {
      result = 1;
    } else if (bDate > aDate) {
      result = -1;
    } else if (aDate > bDate) {
      result = 1;
    }

    return desc ? result * -1 : result;
  };
}
