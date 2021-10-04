import { SortDirection } from '@syncfusion/ej2-angular-grids';
import { GenericTask } from './syncfusion-treegrid/models/generic-task.model';
import { Column, Row } from './syncfusion-treegrid/models/types';

export enum ColumnMessageType {
  EndEdit,
  SetRowValue,
  TaskDeleted,
  ExpandRow,
  AfterTaskAdded,
  MoveTaskWithinGroup,
  SortColumn,
  RefreshGrid,
  CopyTask,
  PasteTask,
  CutTask,
  RefreshHeader,
  RealtimeTaskAdd,
  BulkDelete,
  AddNestedTasks,
  NavigateToTask,
}

export class ColumnMessage {
  messageType: ColumnMessageType;
  messageMeta?: {
    meta?: unknown;
    rowData?: Row;
    column?: Column;
    previousRowValue?: Row;
    previousCellValue?: unknown;
    reloadUI?: boolean;
    sort?: {
      groupId?: string;
      columnId: string;
      order?: SortDirection;
    };
    groupId?: string;
    boardId?: string;
    primaryKey?: string;
    updateRow?: boolean;
  };
  addAction?: IAddRecord;
  deleteAction?: IDeleteRecord;
}
export class IAddRecord {
  record?: GenericTask;
  taskIdToRefer?: string;
  index?: number;
  action?: AddActionType;
  groupId: string;
  records?: GenericTask[];
  editCell: boolean;
  inProcess?: boolean;
}
export type AddActionType = 'Below' | 'Above' | 'Child';
export class IDeleteRecord {
  groupId: string;
  records?: GenericTask[];
}
