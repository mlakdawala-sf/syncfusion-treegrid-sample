import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';

import {
  EditSettingsModel,
  RowPosition,
  TreeGridComponent,
} from '@syncfusion/ej2-angular-treegrid';
import { QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Tooltip } from '@syncfusion/ej2-popups';
import { cloneDeep, isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { dataSource, virtualData } from './datasource';
import { BoardColumn } from './models/board-columns.model';
import {
  FormatData,
  FormattingRule,
} from './models/conditional-formatting.model';
import { GenericTask, IAddRecord } from './models/generic-task.model';

import { Column, Row, UpdateTaskMeta } from './models/types';
import { TaskAdapterService } from './services/task-adapter.service';
import {
  ACTION_REQUEST_TYPES,
  SyncfusionGenericUtilityService,
} from './utils/syncfusion-generic-utility.service';
import { TreeGridUtilityService } from './utils/syncfusion-tree-grid-utility.service';

const GRID_TIMEOUT = 100;

export const APPROXIMATE_CHAR_WIDTH = 7;
export const CELL_PADDING = 30;

@Component({
  selector: 'rpms-treegrid',
  templateUrl: './syncfusion-treegrid.component.html',
  styleUrls: ['./syncfusion-treegrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynkfusionTreeGridComponent
  implements OnInit, OnDestroy, OnChanges
{
  editSettings: EditSettingsModel;
  @Input() dataSource: Row[] = [];

  constructor(
    private readonly gridUtilityService: TreeGridUtilityService,
    private readonly syncfusionUtilityService: SyncfusionGenericUtilityService,
    private readonly taskAdapterService: TaskAdapterService
  ) {}
  @ViewChild('grid') grid: TreeGridComponent;
  ngOnInit() {
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      allowEditOnDblClick: true,
      newRowPosition: 'Below',
      mode: 'Cell',
    };
    // if (this.dataSource.length === 0) {
    //   dataSource();
    // }
    // this.dataSource = tasks.map((x: any) =>
    //   this.taskAdapterService.adaptToModel(x)
    // );
  }

  protected _subscriptions: Subscription[] = [];

  ngOnDestroy() {
    // this._columns = null;
    // this.grid.dataSource = null;
    // this.grid = null;
    this.clearAllSubscriptions();
  }

  clearAllSubscriptions() {
    this._subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this._subscriptions = [];
  }

  lastAddedRecord: IAddRecord[] = [];
  @Output() updateTask = new EventEmitter<UpdateTaskMeta>();
  @Output() updateColumnWidth = new EventEmitter<unknown>();
  @Output() reorderColumn = new EventEmitter<unknown>();
  @Output() toolTip = new EventEmitter<void>();
  @Output() rowSelectedEmitter = new EventEmitter<unknown>();
  @Output() recordDoubleClickEmitter = new EventEmitter<unknown>();
  // tslint:disable-next-line:no-input-rename
  @Input('rpmsConditionalFormatting') formattingRules: FormattingRule[];
  @Input() formatData: FormatData[] = [];
  @Input() groupId: string;
  @Input() boardId: string;
  @Input() gridWidth: string;
  @Input() editColumnHeader: boolean;
  isVirtualizationEnabled = false;
  treeHeight = 'auto';
  @Input() parentIdMapping: string;
  @Input() idMapping: string;
  @Input() childMapping: string;
  @Input() hasPermission = true;
  @Input() maxGridDepth: number;
  @Input() allowReordering = true;

  initialFlag = false;
  private _columns: BoardColumn[];
  previousData: GenericTask;
  showSpinner = false;

  @Input() maxRowsInViewPort: number;
  @Input() mainBoardHeight: number;

  @Input('columns')
  set columns(columns: BoardColumn[]) {
    this._columns = columns;
  }
  get columns() {
    return this._columns;
  }

  selectIndex: number;
  shouldEdit: boolean;
  idToEdit: string;
  isAddInProgress = false;

  ngAfterViewInit() {
    this.grid.grid.resizeSettings = { mode: 'Auto' };
  }

  keyPressed(args: any) {
    this.gridUtilityService.handleKeyPressed(args, this.grid);
  }

  private _columnDeletedRT(deletedColumn: {
    id: string;
    name: string;
    description: string;
    metaData: unknown;
  }) {
    const columnIndex = this.columns.findIndex(
      (column) => column.id === deletedColumn.id
    );
    if (columnIndex !== -1) {
      this.columns.splice(columnIndex, 1);
    }
    this.grid.refreshColumns();
  }

  private _callUpdateTask(
    rowData: Row,
    column: Column,
    previousCellValue?: unknown,
    previousValues?: Row,
    reloadUI = false
  ) {
    // Check if Parent or child Edit

    if (
      // !isEqual(
      //   previousValues?.fieldValues[column.field]?.value,
      //   rowData?.fieldValues[column.field]?.value
      // ) ||
      this.initialFlag
    ) {
      this.initialFlag = false;

      // if (delayedUpdateColumns?.includes(column.columnType)) {
      setTimeout(() => {
        this.updateTask.emit({
          rowData,
          column,
          previousCellValue,
          previousRowValue: previousValues,
          groupId: this.groupId,
          taskId: rowData.id,
          reloadUI,
        });
      }, GRID_TIMEOUT);
    } else {
      this.updateTask.emit({
        rowData,
        column,
        previousCellValue,
        previousRowValue: previousValues,
        groupId: this.groupId,
        taskId: rowData.id,
        reloadUI,
      });
      // }
    }
    if (this.grid.grid?.isEdit) {
      this.grid.saveCell();
    }
  }

  handleEnterKey(args: any) {
    const keyCode = args.which || args.keyCode;
    if (keyCode === 13) {
      this.gridUtilityService.handleEnterKey(args);
    }
  }

  // private _subscribeToColumnMessage() {
  //   this._subscriptions.push(
  //     this.columnMessageService
  //       .getMessage()
  //       .subscribe((message: ColumnMessage) => {
  //         this._handleColumnMessage(message);
  //       })
  //   );
  //   this._subscriptions.push(
  //     this.notificationService.realTimeSubject.subscribe((message) => {
  //       if (
  //         message?.options?.boardId === this.boardId &&
  //         message?.options?.type === NotificationEvents.ColumnDelete
  //       ) {
  //         this._columnDeletedRT(message.options.data);
  //       }
  //     })
  //   );
  // }

  // private _subscribeToSortColumnMessage() {
  //   this._subscriptions.push(
  //     this.columnMessageService
  //       .getMessage()
  //       .subscribe((message: ColumnMessage) => {
  //         this._handleSortColumnMessage(message);
  //       })
  //   );
  // }

  // private _handleSortColumnMessage(message: ColumnMessage) {
  //   if (
  //     message.messageType === ColumnMessageType.SortColumn &&
  //     message?.messageMeta?.sort?.groupId === this.groupId
  //   ) {
  //     const { columnId, order } = message?.messageMeta?.sort;
  //     if (order) {
  //       this.grid.sortByColumn(columnId, order);
  //     } else {
  //       this.grid.clearSorting();
  //     }
  //   }
  // }

  // // sonarignore:start
  // private _handleColumnMessage(message: ColumnMessage) {
  //   if (this.groupId === message?.messageMeta?.rowData?.groupId) {
  //     switch (message.messageType) {
  //       case ColumnMessageType.SetRowValue:
  //         this._setRowValueHandler(message);
  //         break;
  //       case ColumnMessageType.TaskDeleted:
  //         this._deleteRecord(message?.messageMeta?.rowData);
  //         break;
  //       case ColumnMessageType.ExpandRow:
  //         this.gridUtilityService.toggleExpand(
  //           message.messageMeta.rowData,
  //           this.grid,
  //           message.messageMeta.rowData.expanded
  //         );
  //         break;
  //       case ColumnMessageType.EndEdit:
  //         this._handleTaskUpdate(message);
  //         break;
  //       case ColumnMessageType.RealtimeTaskAdd:
  //         this._handleRealtimeTaskAdd(message);
  //         break;
  //       case ColumnMessageType.NavigateToTask:
  //         this.gridUtilityService.navigateToTask(
  //           this.grid,
  //           message?.messageMeta?.rowData?.id,
  //           this.dataSource
  //         );
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  //   if (
  //     message.messageType === ColumnMessageType.RefreshHeader &&
  //     this.boardId === message.messageMeta.boardId
  //   ) {
  //     this.grid.refreshColumns();
  //   } else if (message.messageType === ColumnMessageType.AfterTaskAdded) {
  //     this._handleTaskAddition(message);
  //   } else if (
  //     message.messageType === ColumnMessageType.AddNestedTasks &&
  //     message.addAction.groupId === this.groupId
  //   ) {
  //     this.addNestedRecord(message.addAction);
  //   } else if (
  //     message.messageType === ColumnMessageType.BulkDelete &&
  //     message.deleteAction.groupId === this.groupId
  //   ) {
  //     for (const record of message.deleteAction.records) {
  //       this._deleteRecord(record);
  //     }
  //   }
  //   this._handleGridRefreshMessages(message);
  // }
  // // sonarignore:end

  // private _handleGridRefreshMessages(message: ColumnMessage) {
  //   if (message.messageType === ColumnMessageType.RefreshGrid) {
  //     if (
  //       this.boardId === message?.messageMeta?.boardId ||
  //       this.groupId === message?.messageMeta?.groupId
  //     ) {
  //       this.grid.refresh();
  //     }
  //   }
  // }

  // private _setRowValueHandler(message: ColumnMessage) {
  //   const index = (this.grid?.grid?.dataSource as Row[])?.findIndex(
  //     (val) => val.id === message?.messageMeta?.rowData?.id
  //   );
  //   if (!Number.isFinite(message?.messageMeta?.rowData.depth) && index !== -1) {
  //     const data = this.grid.grid.dataSource[index];
  //     message.messageMeta.rowData.depth = data.depth;
  //   }
  //   this.grid.setRowData(
  //     message?.messageMeta?.rowData[message.messageMeta?.primaryKey ?? 'id'],
  //     message?.messageMeta?.rowData
  //   );

  //   if (index !== -1) {
  //     this.grid.grid.dataSource[index] = message?.messageMeta?.rowData;
  //   }
  // }

  // private _handleTaskUpdate(message: ColumnMessage) {
  //   if (this.groupId === message?.messageMeta?.rowData?.groupId) {
  //     const { rowData, column, previousRowValue, reloadUI } =
  //       message.messageMeta;
  //     this._callUpdateTask(rowData, column, null, previousRowValue, reloadUI);
  //   }
  // }

  // private _handleTaskAddition(message: ColumnMessage) {
  //   const addAction = message.addAction;
  //   if (this.groupId === addAction?.groupId) {
  //     this.lastAddedRecord.push(addAction);
  //     this.addRecordRecursively();
  //   }
  // }

  // private _handleRealtimeTaskAdd(message: ColumnMessage) {
  //   const record = message?.messageMeta?.rowData as GenericTask;
  //   // I want to disable cell editing.
  //   const data: IAddRecord = {
  //     record,
  //     groupId: record.groupId,
  //     editCell: false,
  //   };
  //   if (record.parentTaskId) {
  //     data.taskIdToRefer = record.parentTaskId;
  //     data.action = 'Child';
  //   } else {
  //     data.index = 0;
  //   }
  //   this.lastAddedRecord.push(data);
  //   this.addRecordRecursively();
  // }

  // private _deleteRecord(rowData: AnyObject) {
  //   this.grid.deleteRecord('id', rowData);
  //   const row = this.gridUtilityService.getRow(
  //     this.grid,
  //     rowData.id,
  //     rowData.groupId
  //   );
  //   if (row) {
  //     this.grid.deleteRow(row as HTMLTableRowElement);
  //   }
  // }

  private _addRecordToGrid(data: IAddRecord) {
    this.grid.selectionSettings.persistSelection = true;
    this.grid.selectionSettings.type = 'Multiple';
    const { record, taskIdToRefer } = data;
    if (this.groupId === record?.groupId && this.grid) {
      delete record?.subTasks;
      if (record?.parentTaskId) {
        const parentIndex = this.gridUtilityService.getTreeGridIndex(
          this.grid,
          record.parentTaskId
        );
        this.grid.selectRow(parentIndex as number);
        this.grid.addRecord(record, parentIndex, 'Child');
      } else {
        if (taskIdToRefer) {
          const indexToRefer = this.gridUtilityService.getTreeGridIndex(
            this.grid,
            taskIdToRefer
          );
          this.grid.selectRow(indexToRefer as number);
          this.grid.addRecord(record, indexToRefer, data.action as RowPosition);
        } else {
          this.grid.addRecord(record, 0, 'Top');
        }
      }
      this.isAddInProgress = true;
    }
  }

  addNestedRecord(addAction: IAddRecord) {
    if (addAction.records.length) {
      for (const record of addAction.records) {
        const newAddAction: IAddRecord = {
          action: addAction.action,
          record,
          groupId: addAction.groupId,
          index: addAction.index,
          taskIdToRefer: addAction.taskIdToRefer,
          editCell: false,
          records: [],
        };
        if (newAddAction.record?.parentTaskId) {
          newAddAction.action = 'Child';
          newAddAction.taskIdToRefer = newAddAction.record.parentTaskId;
        }
        this.lastAddedRecord.push(newAddAction);
      }
      this.addRecordRecursively();
    }
  }

  resizeStop(event: any) {
    this.updateColumnWidth.emit({
      columnData: event.column,
      width: event.column.width,
      columns: this.grid.columns,
    });
  }

  columnDrop(event: any) {
    event.groupId = this.groupId;
    this.syncfusionUtilityService.onColumnDrop(event, this.reorderColumn);
  }

  created() {
    this.toolTip.emit();
  }

  cellSave(args: any /*CellSaveArgs*/) {
    const column = args.column as unknown as Column;
    const rowData = args.rowData as unknown as Row;
    document.body.removeAttribute('grid-id');
    // if (
    //   [
    //     ColumnTypesEnum.dependency,
    //     ColumnTypesEnum.priority,
    //     ColumnTypesEnum.status,
    //     ColumnTypesEnum.timeline,
    //     ColumnTypesEnum.dropdown,
    //     ColumnTypesEnum.date,
    //     ColumnTypesEnum.datetime,
    //     ColumnTypesEnum.tag,
    //   ].includes(column.columnType as ColumnTypesEnum)
    // ) {
    //   return;
    // }
    this._callUpdateTask(
      rowData,
      column,
      args.previousValue,
      this.previousData as Row
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes?.columns &&
      changes?.gridWidth?.currentValue &&
      changes.gridWidth.currentValue !== changes.gridWidth.previousValue
    ) {
      if (this.grid) {
        this.grid.columns = changes.columns.currentValue;
        this.grid.grid.widthService?.setWidthToTable();
      }
      if (changes.editColumnHeader) {
        this.gridUtilityService.editColumnHeader(
          this.editColumnHeader,
          this.grid
        );
      }
    }
  }

  cellEdit(event: any) {
    if (this.lastAddedRecord.length) {
      this.grid.closeEdit();
    } else {
      this.previousData = cloneDeep(event.rowData);
    }
    // const [grid] = $(event.cell).closest('.e-grid, .e-treegrid ');
    // document.body.setAttribute('grid-id', grid.id);
  }

  actionBegin(event: any) {
    this.syncfusionUtilityService.onActionBegin(event);
    if (event.requestType === ACTION_REQUEST_TYPES.VIRTUAL_SCROLL) {
      this.showSpinner = true;
    }
  }

  rowDataBound(event: any) {
    this.syncfusionUtilityService.onRowDataBound(event, this.grid);
  }

  actionComplete(args: any): void {
    if (args.requestType === ACTION_REQUEST_TYPES.SAVE) {
      const record = this.lastAddedRecord.find(
        (x) => x.record?.id === args.data.id
      );
      this.lastAddedRecord.splice(0, 1);
      if (record?.editCell && !this.lastAddedRecord.length) {
        this.handleEditChangeAfterTaskAdd(args);
      } else {
        this.addRecordRecursiveHelper();
      }
    } else if (args.requestType === ACTION_REQUEST_TYPES.DELETE) {
      this.handleGridHeightAndVirtualization();
    } else if (
      args.type === 'save' ||
      (!args.cancel && args.requestType !== 'refresh')
    ) {
      this.handleGridHeightAndVirtualization();
      this.addRecordRecursiveHelper();
    } else {
      // sonar
    }
  }

  handleEditChangeAfterTaskAdd(args: any) {
    const id = args.data.id;
    this.selectIndex = args.index;
    this.idToEdit = id;
    setTimeout(() => {
      this.shouldEdit = true;
      this.grid.selectRow(this.selectIndex);
    }, GRID_TIMEOUT);
  }

  rowSelected(args: any) {
    if (this.selectIndex !== -1 && this.shouldEdit) {
      this.shouldEdit = false;
      this.selectIndex = -1;
      this.grid.selectionSettings.persistSelection = false;
      this.grid.selectionSettings.type = 'Single';
      this.grid.clearSelection();
      if (this.lastAddedRecord.length) {
        this.addRecordRecursiveHelper();
      } else {
        setTimeout(() => {
          const index = this.gridUtilityService.getActualRowIndex(
            this.grid,
            this.idToEdit
          );
          if (index !== -1) {
            this.doubleClickCellByIndex(index);
          }
        }, 0);
      }
    }
    this.rowSelectedEmitter.emit(args);
  }

  doubleClickCellByIndex(index: number) {
    const cell = this.grid.getCellFromIndex(index, 1);
    if (cell) {
      const event = new MouseEvent('dblclick', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      cell.querySelector('span')?.dispatchEvent(event);
    }
  }

  addRecordRecursiveHelper() {
    this.isAddInProgress = false;
    this.addRecordRecursively();
    this.grid.selectionSettings.persistSelection = false;
    this.grid.selectionSettings.type = 'Single';
  }

  addRecordRecursively() {
    if (
      this.lastAddedRecord.length &&
      !this.lastAddedRecord[0].inProcess &&
      !this.isAddInProgress
    ) {
      this.lastAddedRecord[0].inProcess = true;
      setTimeout(() => {
        if (this.lastAddedRecord.length) {
          this._addRecordToGrid(this.lastAddedRecord[0]);
        }
      }, GRID_TIMEOUT);
    } else if (!this.lastAddedRecord.length) {
      this.handleGridHeightAndVirtualization();
    } else {
      // sonar
    }
  }

  internalClickEvent(e: any) {
    e.grid = this.grid.grid;
    // Let click event bubble up to be managed at parent level
  }
  recordDoubleClick(event: any) {
    this.recordDoubleClickEmitter.emit(event);
  }

  columnDrag(event: any) {
    if (event.column.collapse) {
      const el = document.getElementsByClassName('e-cloneproperties') as any;
      for (const item of el) {
        (item as HTMLElement).style.display = 'none';
      }
    }
  }

  dataBound() {
    this.showSpinner = false;
  }

  handleGridHeightAndVirtualization() {
    if (this.maxRowsInViewPort && this.mainBoardHeight) {
      const taskCount = this.dataSource.length;
      if (taskCount <= this.maxRowsInViewPort) {
        this.treeHeight = 'auto';
        this.isVirtualizationEnabled = false;
      } else {
        this.treeHeight = this.mainBoardHeight.toString();
        this.isVirtualizationEnabled = true;
      }
    }
  }

  customizeCell(args: QueryCellInfoEventArgs) {
    const style = this.syncfusionUtilityService.computeStyle(
      this.formattingRules,
      this.formatData,
      args.data as GenericTask,
      args.column?.field as string
    );
    let applyLeftPadding = false;
    const columnType = (args.column as any).columnType;
    if (args.column?.field !== 'name') {
      applyLeftPadding = true;
    }

    this.syncfusionUtilityService.applyStyle(
      style,
      args.cell as Element,
      applyLeftPadding
    );
    if (columnType === 'text') {
      this.applyTextTooltip(args);
    }
  }

  applyTextTooltip(args: QueryCellInfoEventArgs) {
    const characterWidth = APPROXIMATE_CHAR_WIDTH;
    const columnWidth = +(args.column?.width ?? 0) - CELL_PADDING;
    const content = (args.data as any).fieldValues[(args as any).column.field]
      ?.value?.displayValue;
    if (content) {
      const contentPxLength = content.length * characterWidth;
      if (contentPxLength > columnWidth) {
        const tooltip: Tooltip = new Tooltip({
          content,
        });
        tooltip.appendTo(args.cell as HTMLElement);
      }
    }
  }
}
