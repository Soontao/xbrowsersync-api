import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

// Interface for bookmarks model
export interface IBookmarks {
  _id?: any;
  bookmarks?: string;
  lastAccessed?: Date;
  lastUpdated?: Date;
  version?: string;
}

// Interface for bookmarks mongoose model
export interface IBookmarksModel extends IBookmarks, mongoose.Document {
  _id: any;
}

// Create bookmarks schema to store bookmarks sync data
// Store IDs as binary uuid v4 and disable default id properties
// No concurrent updates so disable version keys
const bookmarksSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.String,
      default: () => randomUUID().replace(/-/g, ''),
    },
    bookmarks: String,
    lastAccessed: {
      default: Date,
      type: Date,
    },
    lastUpdated: {
      default: Date,
      type: Date,
    },
    version: String,
  },
  {
    _id: false,
    id: false,
    versionKey: false,
  }
);

export const BookmarksModel = mongoose.model<IBookmarksModel>('Bookmark', bookmarksSchema, 'bookmarks');
