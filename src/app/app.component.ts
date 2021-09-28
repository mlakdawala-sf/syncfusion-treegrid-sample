import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { cloneDeep, orderBy } from 'lodash';
import { sampleColumns, sampleGroups } from './syncfusion-treegrid/data';
import { BoardColumn } from './syncfusion-treegrid/models/board-columns.model';
import {
  ColumnTypesEnum,
  Format,
  FormatData,
  FormatEntity,
} from './syncfusion-treegrid/models/conditional-formatting.model';
import { GenericTask } from './syncfusion-treegrid/models/generic-task.model';
import { BoardColumnAdapter } from './syncfusion-treegrid/services/board-column-adapter.service';
import { TaskAdapterService } from './syncfusion-treegrid/services/task-adapter.service';
import { sampleTasks } from './syncfusion-treegrid/tasks';

const NAME_COLUMN_WIDTH = 370;
const ROW_HEIGHT = 40;
const TABLE_HEADER_HEIGHT = 60;
const ACCORDIAN_HEIGHT = 60;
const MIN_ROWS = 20;
const GRID_COMPUTATION_TIMEOUT = 100;
export const TEXT_COLUMN_TYPES: ColumnTypesEnum[] = [
  ColumnTypesEnum.text,
  ColumnTypesEnum.currency,
  ColumnTypesEnum.number,
  ColumnTypesEnum.dropdown,
  ColumnTypesEnum.timeline,
  ColumnTypesEnum.datetime,
  ColumnTypesEnum.date,
  ColumnTypesEnum.percentage,
];
export const ALLOWED_HTML_COLUMN_TYPES: ColumnTypesEnum[] = [
  ColumnTypesEnum.status,
  ColumnTypesEnum.priority,
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'grid-render';
  tasks: GenericTask[] = [];
  columns: BoardColumn[] = [];
  groups: any[] = [];
  groupColumnMap = new Map<string, BoardColumn[]>();
  columnTemplateMap = new Map<string, NgModel>();
  formats: any;
  groupTaskMap: any;
  flatTaskMap = new Map<string, GenericTask[]>();

  constructor(
    private readonly taskAdapterService: TaskAdapterService,
    private readonly colAdapterService: BoardColumnAdapter
  ) {}

  @ViewChild('headerTemplate', { read: TemplateRef })
  public headerTemplate: NgModel;
  @ViewChild('textTemplate', { read: TemplateRef })
  public textTemplate: NgModel;
  @ViewChild('statusTemplate', { read: TemplateRef })
  public statusTemplate: NgModel;
  @ViewChild('priorityTemplate', { read: TemplateRef })
  public priorityTemplate: NgModel;
  @ViewChild('dateTemplate', { read: TemplateRef })
  public dateTemplate: NgModel;
  @ViewChild('currencyTemplate', { read: TemplateRef })
  public currencyTemplate: NgModel;
  @ViewChild('percentageTemplate', { read: TemplateRef })
  public percentageTemplate: NgModel;
  @ViewChild('numberTemplate', { read: TemplateRef })
  public numberTemplate: NgModel;
  @ViewChild('timelineTemplate', { read: TemplateRef })
  public timelineTemplate: NgModel;
  @ViewChild('dateTimeTemplate', { read: TemplateRef })
  public dateTimeTemplate: NgModel;
  @ViewChild('checkboxTemplate', { read: TemplateRef })
  public checkboxTemplate: NgModel;
  @ViewChild('dependencyTemplate', { read: TemplateRef })
  public dependencyTemplate: NgModel;
  @ViewChild('dropdownTemplate', { read: TemplateRef })
  public dropdownTemplate: NgModel;
  @ViewChild('formulaTemplate', { read: TemplateRef })
  public formulaTemplate: NgModel;
  @ViewChild('peopleTemplate', { read: TemplateRef })
  public peopleTemplate: NgModel;
  @ViewChild('lastUpdatedTemplate', { read: TemplateRef })
  public lastUpdatedTemplate: NgModel;
  @ViewChild('tagTemplate', { read: TemplateRef })
  public tagTemplate: NgModel;
  @ViewChildren('tooltip')
  tooltip: ElementRef[];
  @ViewChild('mainBoard')
  mainBoard: ElementRef;

  maxRowsInViewPort = 0;
  mainBoardHeight: number;

  ngAfterViewInit() {
    this.initDatasource();
  }

  setTreeGridProps() {
    this.mainBoardHeight =
      this.mainBoard.nativeElement.offsetHeight -
      (TABLE_HEADER_HEIGHT + ACCORDIAN_HEIGHT);
    let maxRowsInViewPort = this.mainBoardHeight / ROW_HEIGHT;
    // if negative then update with default number of rows for virtualization
    if (maxRowsInViewPort < 0) {
      maxRowsInViewPort = MIN_ROWS;
    }
    this.maxRowsInViewPort = maxRowsInViewPort;
  }

  identify(index: any, item: any) {
    return item.id;
  }

  initDatasource() {
    this.tasks = sampleTasks.map((t: any) =>
      this.taskAdapterService.adaptToModel(t)
    );
    this.columns = sampleColumns.map((t: any) =>
      this.colAdapterService.adaptToModel(t)
    );
    this.groups = sampleGroups;
    this.createGroupColumnMap();
    this.createColumnTemplateMap();

    this.columns.forEach((column) => {
      this.setColumnTemplate(column, this.columnTemplateMap);
    });
    this.setTreeGridProps();
    const data = this.getColumnFormats(this.columns);
    this.formats = data.formats;
    this.groupTaskMap = this.getGroupTaskMap(this.tasks, this.groups);
    for (const group of this.groups) {
      this.flatTaskMap.set(
        group.id,
        this.tasks.filter((x: any) => x.groupId === group.id)
      );
    }
  }

  createGroupColumnMap() {
    this.createGroupColumnMapT(
      this.groupColumnMap,
      this.textTemplate,
      this.headerTemplate
    );
    this.groupColumnMap.forEach((value: BoardColumn[], key: string) => {
      let gridWidth = 0;
      value.forEach((e) => (gridWidth += parseInt(e.width, 10)));
      const selectedGroup = this.groups.find((e) => e.id === key);
      if (selectedGroup) {
        selectedGroup.gridWidth = gridWidth;
      }
    });
  }

  createGroupColumnMapT(
    columnMap: Map<string, BoardColumn[]>,
    // columns: BoardColumn[],
    template: NgModel,
    headerTemplate: NgModel
  ) {
    this.columns = orderBy(this.columns, 'sequenceNumber', 'asc');
    const columnWidth = '120';
    this.groups.forEach((group) => {
      this.columns.unshift(
        new BoardColumn({
          boardId: 'id',
          columnType: 'text',
          template: this.textTemplate,
          editType: 'templateedit',
          field: 'name',
          id: 'name',
          groupId: group.id,
          allowEditing: true,
          width:
            !!columnWidth && Number(columnWidth) > NAME_COLUMN_WIDTH
              ? `${columnWidth}`
              : `${NAME_COLUMN_WIDTH}`,
          minWidth: '370',
          allowReordering: false,
          headerText: group.metaData?.nameColumnTitle?.length
            ? group.metaData.nameColumnTitle
            : 'Items',
          headerTemplate,
          metaData: {
            required: true,
            message: 'Name is required',
          },
        })
      );
      this.columns.unshift(
        new BoardColumn({
          visible: false,
          columnType: 'text',
          field: 'id',
          isPrimaryKey: true,
          width: '0',
        })
      );
      const columnArray = [...this.columns];
      columnMap.set(group.id, columnArray);
    });
  }

  private setColumnEditTemplate(column: BoardColumn) {
    const { columnType } = column;
    column.headerTemplate = this.headerTemplate;
    column.editType = 'templateedit';
    if (columnType === 'text') {
      // column.edit = this.getTextEditColumnParams(
      //   this.resolver,
      //   this.viewContainerRef
      // );
    }
    if (
      [
        ColumnTypesEnum.priority,
        ColumnTypesEnum.status,
        ColumnTypesEnum.dropdown,
      ].includes(columnType as ColumnTypesEnum)
    ) {
      let templateField = '';
      if (columnType === ColumnTypesEnum.priority) {
        templateField = 'availablePriorities';
      } else if (columnType === ColumnTypesEnum.status) {
        templateField = 'availableStatus';
      } else {
        templateField = 'options';
      }
      // column.edit = this.getDropdownEditTemplate(
      //   this.resolver,
      //   this.viewContainerRef,
      //   templateField
      // );
    }
    if (
      [ColumnTypesEnum.datetime, ColumnTypesEnum.date].includes(
        columnType as ColumnTypesEnum
      )
    ) {
      // const data = this.getDateEditTemplate(
      //   columnType === ColumnTypesEnum.datetime
      // );
      // column.edit = this.createColumnEditTemplate(
      //   this.resolver,
      //   DateTimeEditTemplateComponent,
      //   this.viewContainerRef,
      //   data
      // );
    }
    if (
      [
        ColumnTypesEnum.currency,
        ColumnTypesEnum.percentage,
        ColumnTypesEnum.number,
      ].includes(column.columnType as ColumnTypesEnum)
    ) {
      // column.edit = this.columnUtilityService.getNumberEditColumnParams(
      //   this.resolver,
      //   this.viewContainerRef
      // );
    }

    if (columnType === ColumnTypesEnum.timeline) {
      // const data: TimelineEditTemplate = {
      //   focuslost: (event) => this.columnUtilityService.focuslost(event),
      //   timelineSelected: (event) => this.timelineSelected(event),
      // };
      // column.edit = this.columnUtilityService.createColumnEditTemplate(
      //   this.resolver,
      //   TimelineEditTemplateComponent,
      //   this.viewContainerRef,
      //   data
      // );
    }
    if (columnType === ColumnTypesEnum.people) {
      // column.edit = this.columnUtilityService.getPeopleEditTemplate(
      //   this.resolver,
      //   this.viewContainerRef
      // );
    }
    if (columnType === ColumnTypesEnum.tag) {
      // column.edit = this.columnUtilityService.getTagsEditTemplate(
      //   this.resolver,
      //   this.viewContainerRef
      // );
    }
  }

  createColumnTemplateMap() {
    this.columnTemplateMap.set(ColumnTypesEnum.text, this.textTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.status, this.statusTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.priority, this.priorityTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.date, this.dateTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.currency, this.currencyTemplate);
    this.columnTemplateMap.set(
      ColumnTypesEnum.percentage,
      this.percentageTemplate
    );
    this.columnTemplateMap.set(ColumnTypesEnum.number, this.numberTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.timeline, this.timelineTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.datetime, this.dateTimeTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.checkbox, this.checkboxTemplate);
    this.columnTemplateMap.set(
      ColumnTypesEnum.dependency,
      this.dependencyTemplate
    );
    this.columnTemplateMap.set(ColumnTypesEnum.dropdown, this.dropdownTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.people, this.peopleTemplate);
    this.columnTemplateMap.set(ColumnTypesEnum.formula, this.formulaTemplate);
    this.columnTemplateMap.set(
      ColumnTypesEnum.lastUpdated,
      this.lastUpdatedTemplate
    );
    this.columnTemplateMap.set(ColumnTypesEnum.tag, this.tagTemplate);
  }

  setColumnTemplate(
    column: BoardColumn,
    columnTypeTemplateMap: Map<string, NgModel>
  ) {
    const { columnType } = column;
    this.setColumnTemplateAndAccessor(
      column,
      columnTypeTemplateMap,
      columnType as ColumnTypesEnum
    );
  }

  getStatusHtmlValue(field: string, data: GenericTask, column: BoardColumn) {
    const value = data.fieldValues[column?.field]?.value?.displayValue;
    if (!value) {
      return '';
    }

    return `<span class="template-label-text">
              <span
              class="status-color"
              style="color:red"
              >&#11044;</span>
              ${value}
            </span>`;
  }

  getPriorityHtmlValue(field: string, data: GenericTask, column: BoardColumn) {
    const value = data.fieldValues[column?.field]?.value?.displayValue;
    if (!value) {
      return '';
    }
    const color = data.fieldValues[column.field]?.value?.color;
    const bgColor = data.fieldValues[column.field]?.value?.bgColor;
    return `<span
            class="template-label-text e-customCell"
            style="background-color:${bgColor}">
              <label
                class="task-name-inner-text cursor-pointer"
                style="color:${color}"
                >${value}</label>
            </span>`;
  }

  setColumnTemplateAndAccessor(
    column: BoardColumn,
    columnTypeTemplateMap: Map<string, NgModel>,
    columnType: ColumnTypesEnum
  ) {
    if (ALLOWED_HTML_COLUMN_TYPES.includes(columnType)) {
      column.disableHtmlEncode = false;
      switch (column.columnType) {
        case ColumnTypesEnum.status:
          column.valueAccessor = this.getStatusHtmlValue;
          break;
        case ColumnTypesEnum.priority:
          column.valueAccessor = this.getPriorityHtmlValue;
          break;
        default:
          break;
      }
    } else if (TEXT_COLUMN_TYPES.includes(columnType)) {
      column.valueAccessor = this.customValueAccessor;
    } else {
      column.template = columnTypeTemplateMap.get(columnType);
    }
  }

  customValueAccessor(
    field: string,
    data: GenericTask,
    column: BoardColumn
  ): string {
    const value = data.fieldValues[column.field]?.value;
    switch (column.columnType) {
      case ColumnTypesEnum.currency:
        const currencyValue = value.value?.toLocaleString('en', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return currencyValue ? `${column.metaData?.unit} ${currencyValue}` : '';
      // case ColumnTypesEnum.percentage:
      //   return value?.value ? `${value.value} %` : '';
      // case ColumnTypesEnum.date:
      //   return FormatDatePipe.prototype.transform(value.value);
      // case ColumnTypesEnum.datetime:
      //   return FormatDateTimePipe.prototype.transform(value.value);
      // case ColumnTypesEnum.timeline:
      //   return `${FormatTimelinePipe.prototype.transform(
      //     value,
      //   )} ${DurationTimelinePipe.prototype.transform(value)}`;
      default:
        return data.fieldValues[column.field]?.value?.displayValue;
    }
  }

  getColumnFormats(columns: BoardColumn[]) {
    const formats: FormatData[] = [];
    const columnFormatMap = new Map<string, Format>();
    columns.forEach((col, i) => {
      if (col.format) {
        const data = new FormatData();
        data.id = col.id;
        data.type = FormatEntity.Column;
        data.format = {
          bold: { value: true, modified: new Date() },
          italic: { value: true, modified: new Date() },
          underlined: { value: true, modified: new Date() },
          fgColor: { value: `#123456`, modified: new Date() },
          bgColor: { value: `#1c${i}`, modified: new Date() },
        };
        formats.push(data);
        columnFormatMap.set(col.id, col.format);
      }
    });
    return { formats, columnFormatMap };
  }

  getGroupTaskMap(
    sharedDataSource: GenericTask[],
    groups: any[],
    isFilterApplied = false
  ) {
    sharedDataSource = cloneDeep(sharedDataSource);
    const groupTaskMap = new Map<string, GenericTask[]>();
    groups.forEach((group) => {
      const groupTasks = sharedDataSource.filter(
        (task) => task.groupId === group.id
      );
      const rootLevelGroupTasks = this.getRootLevelTasks(groupTasks);
      if (isFilterApplied) {
        this.fillSubTasksRecursivelyWithoutDepthAssignment(
          groupTasks,
          rootLevelGroupTasks
        );
      } else {
        this.fillSubTasksRecursively(groupTasks, rootLevelGroupTasks);
      }
      groupTaskMap.set(group.id, rootLevelGroupTasks);
    });
    return groupTaskMap;
  }

  getRootLevelTasks(tasks: GenericTask[]) {
    const filteredTasks = tasks.filter(
      (task) => !task.parentTaskId || task.parentTaskId === task.id
    );
    return orderBy([...filteredTasks], 'sequenceNumber', 'asc');
  }

  fillSubTasksRecursivelyWithoutDepthAssignment(
    sharedDataSource: GenericTask[],
    tasks: GenericTask[],
    rootTaskId?: string
  ) {
    for (const parentTask of tasks) {
      const subTasks = sharedDataSource.filter(
        (task) =>
          task.parentTaskId === parentTask.id && task.parentTaskId !== task.id
      );
      parentTask.subTasks = orderBy(subTasks, 'sequenceNumber', 'asc');
      if (!rootTaskId) {
        rootTaskId = parentTask.id;
      } else {
        parentTask.rootId = rootTaskId;
      }
      if (parentTask?.subTasks?.length) {
        this.fillSubTasksRecursivelyWithoutDepthAssignment(
          sharedDataSource,
          parentTask.subTasks as GenericTask[],
          rootTaskId
        );
      }
    }
  }

  fillSubTasksRecursively(
    sharedDataSource: GenericTask[],
    tasks: GenericTask[],
    depth = -1,
    rootTaskId?: string
  ) {
    for (const parentTask of tasks) {
      if (!rootTaskId) {
        rootTaskId = parentTask.id;
      } else {
        parentTask.rootId = rootTaskId;
      }
      parentTask.depth = depth;
      const subTasks = sharedDataSource.filter(
        (task) =>
          task.parentTaskId === parentTask.id && task.parentTaskId !== task.id
      );
      parentTask.subTasks = orderBy(subTasks, 'sequenceNumber', 'asc');
      if (parentTask?.subTasks?.length) {
        let newDepth = depth;
        newDepth += 1;
        this.fillSubTasksRecursively(
          sharedDataSource,
          parentTask.subTasks as GenericTask[],
          newDepth
        );
      }
    }
  }

  updateTask(e: any) {
    //do nothing
  }
}
