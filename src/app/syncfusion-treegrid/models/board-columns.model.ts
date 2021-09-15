import { Column, Row } from './types';

export class BoardColumn extends Column {
  boardId: string;
  groupId?: string;
  metaData: any;
  level: number;
  sequenceNumber: number;
  description: string;
  lockColumn: boolean;
  allowReordering: boolean;
  allowResizing: boolean;
  width: string;
  minWidth: string;
  maxWidth: string;
  freeze: string;
  visible: boolean;
  collapse: boolean;
  edit: unknown;
  taskColumnValues?: any[];
  sortComparer: (
    reference: undefined,
    comparer: undefined,
    referenceItem: Row,
    comparerItem: Row
  ) => number;
  valueAccessor: any;
  constructor(data?: Partial<BoardColumn>) {
    super(data);
    this.boardId = data?.boardId;
    this.groupId = data?.groupId;
    this.metaData = data?.metaData;
    this.level = data?.level;
    this.visible = data?.visible;
    this.sequenceNumber = data?.sequenceNumber;
    this.lockColumn = data?.lockColumn;
    this.description = data?.description;
    this.allowReordering = data?.allowReordering;
    this.width = data?.width;
    this.minWidth = data?.minWidth;
    this.maxWidth = data?.maxWidth;
    this.name = data?.name;
    this.freeze = data?.freeze;
    this.collapse = data?.collapse;
    this.edit = data?.edit;
    this.format = data?.format;
  }
}
