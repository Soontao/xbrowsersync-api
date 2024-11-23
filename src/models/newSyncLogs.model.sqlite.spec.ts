import { NewSyncLogsModel } from './newSyncLogs.model.sqlite';
import { connect, disconnect } from '../db.sqlite';
import { tmpdir } from 'os';
import path from 'path';
import { randomUUID } from 'crypto';

describe('newSyncLogs.model sqlite Test Suite', () => {
  beforeAll(() => connect(path.join(tmpdir(), Date.now() + '.db')));
  afterAll(() => disconnect());

  it('should create a new sync log', async () => {
    const id = randomUUID().replace(/-/g, '');
    const syncCreated = new Date('2020-01-01T00:00:00.000Z');
    const ipAddress = '192.168.1.1';
    const newSyncLogsModel = new NewSyncLogsModel({ _id: id, syncCreated: syncCreated, ipAddress: ipAddress });
    await newSyncLogsModel.save();
    expect(await NewSyncLogsModel.estimatedDocumentCount().exec()).toBe(1);
  });

  it('should support count by filter', async () => {
    const ipAddress = '192.168.1.255';

    for (const k of Array(10).fill(0).keys()) {
      await new NewSyncLogsModel({ _id: randomUUID().replace(/-/g, ''), ipAddress: `10.1.1.${k}` }).save();
    }

    expect(await NewSyncLogsModel.countDocuments({ ipAddress }).exec()).toBe(0);
    expect(await NewSyncLogsModel.countDocuments({ ipAddress: '10.1.1.1' }).exec()).toBe(1);
    await new NewSyncLogsModel({ _id: randomUUID().replace(/-/g, ''), ipAddress }).save();

    expect(await NewSyncLogsModel.countDocuments({ ipAddress: ipAddress }).exec()).toBe(1);
  });
});
