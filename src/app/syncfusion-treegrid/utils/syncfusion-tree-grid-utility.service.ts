import { Injectable, NgZone } from '@angular/core';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { GenericTask } from '../models/generic-task.model';
import { Row } from '../models/types';
import { GridEventService } from '../services/grid-event.service';

export const V_KEY_CODE = 86;
export const MIDDLE_CELL_CLASS = 'middle-cell-selection';
export const BOTTOM_CELL_CLASS = 'bottom-cell-selection';
export const TOP_CELL_CLASS = 'top-cell-selection';
export const DEFAULT_CELL_CLASS = 'default-cell-selection';
export const SELECTION_BACKGROUND_CLASS = 'e-selectionbackground';
export const GROUP_PREFIX = 'Group_';
export const COLUMN_HEADER_TEXT_LENGTH = 20;
export const CHILD_GRID_PREFIX = 'childGrid_';
export const ROW_INDEX_ATTR = 'aria-rowindex';
export const CTRL_KEY_CODE = 17;
export const C_KEY_CODE = 67;
export const X_KEY_CODE = 88;
export const ENTER_KEY_CODE = 13;
export const ESCAPE_KEY_CODE = 27;

@Injectable()
export class TreeGridUtilityService {
  constructor(
    private readonly ngZone: NgZone,
    private readonly gridEventService: GridEventService
  ) {}

  getRowIndex(grid: TreeGridComponent, taskId: string, groupId: string) {
    const rowSelectedData: any = grid.element.querySelector(
      `[data-row-id="${groupId}_ROW_${taskId}"]`
    );
    return parseInt(rowSelectedData?.ariaRowIndex, 10);
  }

  getRow(grid: TreeGridComponent, taskId: string, groupId: string) {
    return grid.element.querySelector(
      `[data-row-id="${groupId}_ROW_${taskId}"]`
    );
  }

  getTreeGridIndex(grid: TreeGridComponent, taskId: string) {
    const rowSelectedData = grid
      .getCurrentViewRecords()
      .find((x: any) => x.id === taskId);
    if (rowSelectedData) {
      return parseInt((rowSelectedData as any).index, 10);
    }
    return undefined;
  }

  getActualRowIndex(grid: TreeGridComponent, taskId: string) {
    return grid.getCurrentViewRecords().findIndex((x: any) => x.id === taskId);
  }

  toggleExpand(rowData: Row, grid: TreeGridComponent, expand: boolean) {
    const id = rowData.id;
    const index = this.getRowIndex(grid, id, rowData.groupId as string);
    const row = grid.getRowByIndex(index) as HTMLTableRowElement;
    if (!row) {
      return;
    }
    if (expand) {
      grid.expandRow(row);
    } else {
      grid.collapseRow(row);
    }

    // now update the actual object in grid-datasource
    const ds = grid.dataSource as GenericTask[];
    const toggledRow = ds?.find((task) => task.id === rowData.id);

    if (toggledRow) {
      toggledRow.expanded = expand;
    }
  }

  addCustomCellClass(
    cells: NodeListOf<HTMLTableDataCellElement>,
    className: string
  ) {
    cells.forEach((cell) => cell?.classList?.add(className));
  }

  removeHighlightedRow(rows: HTMLTableRowElement[]) {
    rows.forEach((row) => {
      const cells = row?.querySelectorAll('td');
      if (cells?.length) {
        cells.forEach((cell) =>
          cell?.classList?.remove(
            MIDDLE_CELL_CLASS,
            BOTTOM_CELL_CLASS,
            TOP_CELL_CLASS,
            DEFAULT_CELL_CLASS
          )
        );
      }
    });
  }

  displayHighlightedRow(rows: HTMLTableRowElement[]) {
    rows.forEach((row) => {
      const cells = row?.querySelectorAll('td');
      if (cells?.length) {
        const prev = row?.previousElementSibling;
        const next = row?.nextElementSibling;
        const isPrevRowSelected = rows.some((r) => r === prev);
        const isNextRowSelected = rows.some((r) => r === next);
        if (isPrevRowSelected && isNextRowSelected) {
          this.addCustomCellClass(cells, MIDDLE_CELL_CLASS);
        } else if (isPrevRowSelected) {
          this.addCustomCellClass(cells, BOTTOM_CELL_CLASS);
        } else if (isNextRowSelected) {
          this.addCustomCellClass(cells, TOP_CELL_CLASS);
        } else {
          this.addCustomCellClass(cells, DEFAULT_CELL_CLASS);
        }
      }
    });
  }

  handleKeyPressed(args: any, grid: TreeGridComponent) {
    const keyCode = args.which || args.keyCode;
    // sonarignore:start
    const isCtrlKey =
      args.ctrlKey || args.metaKey
        ? true
        : keyCode === CTRL_KEY_CODE
        ? true
        : false;
    // sonarignore:end
    if (keyCode === ENTER_KEY_CODE) {
      // overriding default enter behaviour
      this.handleEnterKey(args, grid);
      return false;
    } else {
      return false;
    }
  }

  handleEnterKey(args: any, grid?: TreeGridComponent) {
    args.cancel = true;
    this.ngZone.run(() => {
      if (!grid) {
        return this.gridEventService.callGridEditSave();
      }
      if ((grid as any).isEdit) {
        grid.saveCell();
      }
      return null;
    });
  }

  editColumnHeader(flag: boolean, grid: TreeGridComponent) {
    if (flag) {
      grid?.startEdit();
      (grid as any).isEdit = true;
    } else {
      grid?.endEdit();
    }
  }

  navigateToTask(grid: TreeGridComponent, taskId: string, rows: Row[]) {
    const index = rows?.findIndex((row) => row.id === taskId);
    if (index >= 0) {
      grid.selectRow(index);
    }
  }
}
