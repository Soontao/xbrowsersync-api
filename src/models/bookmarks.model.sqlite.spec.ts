import { BookmarksModel } from './bookmarks.model.sqlite';
import { connect, disconnect } from '../db.sqlite';
import { tmpdir } from 'os';
import path from 'path';

describe('bookmarks.model.sqlite Test Suite', () => {

  beforeAll(() => connect(path.join(tmpdir(), Date.now() + '.db')));
  afterAll(() => disconnect());

  it('should be able to create a bookmark', async () => {
    const testId = 'test-id-0001';
    const bookmarks = new BookmarksModel({ _id: testId, bookmarks: '' });
    await bookmarks.save();
    const r = connect.db.prepare('SELECT * FROM Documents where `id` = ?').all(testId) as any[];
    expect(r).not.toBeNull();
    expect(r?.[0].id).toBe(testId);
    expect(r?.[0].type).toBe('BookmarksModel')

    const count = await BookmarksModel.estimatedDocumentCount().exec();
    expect(count).toBe(1);

    const r2 = await BookmarksModel.findById(testId).exec();
    expect(r2).not.toBeNull();
    expect(r2?._id).toBe(testId);

    const r3 = await BookmarksModel.findOneAndUpdate({ _id: testId }, { bookmarks: 'test' }).exec();
    expect(r3.bookmarks).toBe('');

    const r4 = await BookmarksModel.findOneAndUpdate({ _id: testId }, { bookmarks: 'test2' }, { new: true }).exec();
    expect(r4.bookmarks).toBe('test2');
  });

});
