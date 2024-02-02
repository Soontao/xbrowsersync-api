// @ts-nocheck
import 'jest';
import moment from 'moment';
import { NewSyncLogsModel } from './newSyncLogs.model';

describe('NewSyncLogsModel', () => {

  it('newSyncLogsSchema: should set expiresAt value by default to the start of the following day', () => {
    const newSyncLogsModel = new NewSyncLogsModel();
    expect(newSyncLogsModel.expiresAt).toStrictEqual(moment().add(1, 'days').startOf('day').toDate());
  });

  it('newSyncLogsSchema: should set syncCreated value by default to the current date', () => {
    const newSyncLogsModel = new NewSyncLogsModel();
    expect(newSyncLogsModel.syncCreated.getTime()).toBeCloseTo(moment().toDate().getTime(), -2);
  });
});
