// provide limited model functionalities like mongo but implemented by sqlite
import type { IBookmarks } from './bookmarks.model';

import { BaseModel } from './BaseModel.sqlite';

export class BookmarksModel extends BaseModel<IBookmarks> {}
