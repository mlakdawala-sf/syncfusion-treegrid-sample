import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';

import {
  EditSettingsModel,
  TreeGridComponent,
} from '@syncfusion/ej2-angular-treegrid';
import { dataSource, virtualData } from './datasource';

import { Column, Row, UpdateTaskMeta } from './models/types';
import { TaskAdapterService } from './services/task-adapter.service';
import { tasks } from './tasks';

const GRID_TIMEOUT = 100;

@Component({
  selector: 'rpms-treegrid',
  templateUrl: './syncfusion-treegrid.component.html',
  styleUrls: ['./syncfusion-treegrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynkfusionTreeGridComponent implements OnInit {
  constructor(private readonly taskAdapterService: TaskAdapterService) {}
  editSettings: EditSettingsModel;
  @Input() columns: any[];
  dataSource: Row[] = [];

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
    this.dataSource = tasks.map((x) => this.taskAdapterService.adaptToModel(x));
  }
}
