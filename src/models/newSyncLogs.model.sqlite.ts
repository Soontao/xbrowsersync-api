// provide limited model functionalities like mongo but implemented by sqlite
import type { INewSyncLogsModel, INewSyncLog } from './newSyncLogs.model';

import { BaseModel } from './BaseModel.sqlite';

export class NewSyncLogsModel extends BaseModel<INewSyncLogsModel> {}

export { INewSyncLogsModel, INewSyncLog };
