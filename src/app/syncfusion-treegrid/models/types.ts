import { Format } from './conditional-formatting.model';

export class Row {
  constructor(data: Partial<Row>) {
    this.fieldValues = data?.fieldValues;
    this.sequenceNumber = data?.sequenceNumber || 0;
  }
  id: string;
  name: string;
  fieldValues?: { [key: string]: ColumnValue };
  column: Column;
  groupId?: string;
  index?: number;
  parentTaskId?: string;
  sequenceNumber?: number;
  expanded?: boolean;
  active?: boolean;
  subTasks?: Row[];
  depth: number;
}

export class Column {
  id: string;
  name: string;
  columnType: string;
  headerText: string;
  isPrimaryKey: boolean;
  field: string;
  editType: string;
  format: Format;
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
  disableHtmlEncode: boolean;
  constructor(data: Partial<Column>) {
    this.columnType = data?.columnType;
    this.field = data?.field;
    this.template = data?.template;
    this.editTemplate = data?.editTemplate;
    this.headerText = data?.headerText;
    this.customAttributes = data?.customAttributes;
    this.allowEditing = data?.allowEditing;
    this.headerTemplate = data?.headerTemplate;
    this.width = data?.width;
    this.type = data?.type;
    this.isPrimaryKey = data?.isPrimaryKey;
  }
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
