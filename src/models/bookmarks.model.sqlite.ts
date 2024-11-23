// provide limited model functionalities like mongo but implemented by sqlite
import type { IBookmarks } from './bookmarks.model';

import { BaseModel } from './BaseModel.sqlite';

export class BookmarksModel extends BaseModel<IBookmarks> {
  constructor(doc: Partial<IBookmarks>) {
    if (!doc.lastAccessed) {
      doc.lastAccessed = new Date();
    }
    if (!doc.lastUpdated) {
      doc.lastUpdated = new Date();
    }
    super(doc);
  }
}
export { IBookmarks };
