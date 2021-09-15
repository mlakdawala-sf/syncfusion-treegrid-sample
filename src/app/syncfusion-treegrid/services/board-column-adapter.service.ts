import { Injectable } from '@angular/core';
import { BoardColumn } from '../models/board-columns.model';
import { ColumnTypesEnum } from '../models/conditional-formatting.model';

const COL_WIDTH = '200';
const COL_TIMELINE_DURATION = '250';
const COL_PEOPLE_WIDTH = '250';

@Injectable()
export class BoardColumnAdapter {
  adaptToModel(res: any): BoardColumn {
    const boardColumn = new BoardColumn();
    boardColumn.id = res.id;
    boardColumn.columnType = res.columnType;
    boardColumn.name = res.name;
    boardColumn.headerText = res.name;
    boardColumn.field = res.id;
    boardColumn.metaData = res.metaData;
    boardColumn.description = res.description;
    boardColumn.textAlign = 'Center';
    boardColumn.width = res.metaData.width || COL_WIDTH;
    boardColumn.isPrimaryKey = false;
    boardColumn.allowEditing = true;
    boardColumn.allowReordering = res.metaData.allowReorder || 'true';
    boardColumn.sequenceNumber = Number(res.sequenceNumber) || 0;
    boardColumn.minWidth = '120';
    boardColumn.maxWidth = '600';
    boardColumn.format = res.format;

    if (boardColumn.columnType === 'text') {
      boardColumn.metaData = {
        required: false,
        message: 'Text Column Value Required',
      };
    }
    if (boardColumn.columnType === 'status') {
      boardColumn.metaData.availableStatus =
        boardColumn.metaData?.availableStatus?.map((val: any) => {
          val.text = val.value;
          val.iconClass = 'status';
          return val;
        });
    }
    if (boardColumn.columnType === 'dropdown') {
      boardColumn.metaData.options = boardColumn.metaData?.options?.map(
        (val: any) => {
          val.text = val.displayValue;
          return val;
        }
      );
    }
    if (boardColumn.columnType === 'priority') {
      boardColumn.metaData.availablePriorities =
        boardColumn.metaData?.availablePriorities?.map((val: any) => {
          val.iconClass = 'status';
          val.text = val.displayValue;
          return val;
        });
    }
    if (
      boardColumn.columnType === 'datetime' ||
      boardColumn.columnType === 'date'
    ) {
      boardColumn.width = res.metaData.width || COL_WIDTH;
    }
    if (boardColumn.columnType === 'timeline') {
      boardColumn.width = res.metaData.width || COL_TIMELINE_DURATION;
      boardColumn.minWidth = COL_TIMELINE_DURATION;
    }
    if (boardColumn.columnType === 'people') {
      boardColumn.minWidth = COL_PEOPLE_WIDTH;
    }
    this.appendTaskColumnValue(boardColumn, res);
    this.ifLastUpdated(boardColumn);
    this.ifTagsColumn(boardColumn, res);
    this.addGroupId(boardColumn, res);
    return boardColumn;
  }

  addGroupId(boardColumn: BoardColumn, resp: any) {
    boardColumn.groupId = resp?.groupId ?? undefined;
  }

  appendTaskColumnValue(boardColumn: BoardColumn, resp: any) {
    boardColumn.taskColumnValues = resp.taskColumnValues ?? [];
  }

  ifTagsColumn(boardColumn: BoardColumn, res: any) {
    if (boardColumn.columnType === ColumnTypesEnum.tag) {
      boardColumn.minWidth = res.metaData.width || COL_WIDTH;
    }
  }
  ifLastUpdated(boardColumn: any) {
    if (boardColumn.columnType === ColumnTypesEnum.lastUpdated) {
      boardColumn.width = COL_PEOPLE_WIDTH;
      boardColumn.minWidth = COL_TIMELINE_DURATION;
    }
  }

  adaptFromModel(data: any): any {
    return data;
  }
}
