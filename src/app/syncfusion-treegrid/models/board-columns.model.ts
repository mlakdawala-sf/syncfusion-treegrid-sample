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
}
