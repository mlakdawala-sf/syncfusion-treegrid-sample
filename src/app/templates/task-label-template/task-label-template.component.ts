import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-task-label-template]',
  templateUrl: './task-label-template.component.html',
  styleUrls: ['./task-label-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskLabelTemplateComponent {
  columnValue: any;
  _data: any;
  subtaskCount = 0;
  isRootTask: boolean;
  @Input() set data(val) {
    this._data = val;
    if (this._data) {
      this.columnValue = this._data.fieldValues[this._data?.column?.field];
      this.subtaskCount = this._data.childRecords?.length;
      this.isRootTask = this._data.depth === -1 ? true : false;
    }
  }

  get data() {
    return this._data;
  }

  @Input() itemViewPermission: boolean;
  @Input() maxGridDepth: number;
  @Input() hasPermission: boolean;
  @Input() isBoardOwner: boolean;

  @Input() isFilterApplied = false;
  @Input() isGuestUser = false;
}
