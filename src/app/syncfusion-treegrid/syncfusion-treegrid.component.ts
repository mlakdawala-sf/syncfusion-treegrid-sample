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
  }

  protected _subscriptions: Subscription[] = [];

  ngOnDestroy() {
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

  cellSave(args: any /*CellSaveArgs*/) {}

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
  }

  actionBegin(event: any) {
    this.syncfusionUtilityService.onActionBegin(event);
    // if (event.requestType === ACTION_REQUEST_TYPES.VIRTUAL_SCROLL) {
    //   this.showSpinner = true;
    // }
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
