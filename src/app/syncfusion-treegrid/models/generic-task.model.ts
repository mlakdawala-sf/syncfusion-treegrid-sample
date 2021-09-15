import { Row } from './types';

export class GenericTask extends Row {
  groupId: string;
  boardId: string;
  sequenceNumber?: number;
  taskUpdatesCount?: number;
  createdOn?: Date;
  parentTaskId?: string;
  metaData: any;
  boardGroups: any[];
  // sonarignore:start
  taskColumnValues: any;
  // sonarignore:end
  itemPermission?: any;
  taskFilesCount?: number;
  proofFilesCount?: number;
  description?: string;
  comments?: string[]; // comments can be combined from messages for export purposes
  rootId?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
  filesUpdatesCount?: number;
  boardTaskPermissions: any;
  constructor(data: Partial<GenericTask>) {
    super(data);
    this.groupId = data.groupId as string;
    this.boardId = data.boardId as string;
    this.taskUpdatesCount = data?.taskUpdatesCount;
    this.parentTaskId = data?.parentTaskId;
    this.subTasks = data?.subTasks;
    this.sequenceNumber = data?.sequenceNumber || 0;
    this.metaData = data?.metaData;
    this.taskColumnValues = data?.taskColumnValues;
    this.itemPermission = data?.itemPermission;
    this.boardTaskPermissions = data?.boardTaskPermissions;
    this.taskFilesCount = data?.taskFilesCount;
    this.proofFilesCount = data?.proofFilesCount;
    this.description = data?.description;
    this.modifiedOn = data?.modifiedOn;
    this.modifiedBy = data?.modifiedBy;
    this.fieldValues = data?.fieldValues;
  }
}

export class IAddRecord {
  record?: GenericTask;
  taskIdToRefer?: string;
  index: number;
  action?: string;
  groupId: string;
  records: GenericTask[];
  editCell: boolean;
  inProcess?: boolean;
}
