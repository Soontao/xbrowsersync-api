// Interface for new sync log model
export interface INewSyncLog {
  _id?: any;
  expiresAt?: Date;
  ipAddress?: string;
  syncCreated?: Date;
}

export type INewSyncLogsModel = INewSyncLog;
