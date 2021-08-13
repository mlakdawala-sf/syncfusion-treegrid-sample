export class Row {
  column?: Column;
  id: string;
}

export class Column {
  columnType: string;
  headerText: string;
  isPrimaryKey: boolean;
  field: string;
  editType: string;

  allowEditing: boolean;
  width: string;
  textAlign: string;
  customAttributes: unknown;
  template: unknown;
  editTemplate: unknown;
  headerTemplate: unknown;
  type: string;
  index?: number;
  metaData?: unknown;
}

export class ColumnValue {
  id?: string;
  taskId: string;
  value: any;
  key?: string;
  columnId: string;
  kanbanSequenceNumber?: number;
}

export class TaskValue {
  id?: string;
  value: IValue;
  columnId: string;
  taskId: string;
}

interface IValue {
  value: unknown;
  meta?: any;
}

export class UpdateTaskMeta {
  rowData: Row;
  column: Column;
  taskId: string;
  previousCellValue?: unknown;
  previousRowValue?: Row;
  groupId?: string;
  reloadUI?: boolean;
}
export class UpdateRowState {
  expanded: boolean;
  rowData: Row;
}

export class MoveTaskToGroupMeta {
  taskId: string;
  fromGroupId: string;
  toGroupId: string;
  toIndex: number;
  fromIndex: number;
  boardId: string;
}

export class UpdateRowSelection {
  rowData?: Row;
  selectedRows?: number[];
}
