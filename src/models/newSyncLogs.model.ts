import mongoose from 'mongoose';

// Interface for new sync log model
export interface INewSyncLog {
  expiresAt?: Date;
  ipAddress?: string;
  syncCreated?: Date;
}

export interface INewSyncLogsModel extends INewSyncLog, mongoose.Document {}
