import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import {
  AccordionComponent,
  Item,
  AccordionItem,
  ExpandEventArgs,
} from '@syncfusion/ej2-angular-navigations';
import { Effect } from '@syncfusion/ej2-base';
import { chunk } from 'lodash';
import { ColumnTypesEnum } from '../syncfusion-treegrid/models/conditional-formatting.model';
import {
  CTRL_KEY_CODE,
  V_KEY_CODE,
} from '../syncfusion-treegrid/utils/syncfusion-tree-grid-utility.service';

@Component({
  selector: 'app-accordian',
  templateUrl: './accordian.component.html',
  styleUrls: ['./accordian.component.scss'],
})
export class AccordianComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  @ViewChild('element') acrdnInstance: AccordionComponent;
  @Input() isExpanded: boolean = true;
  @Input() hasEditPermission: boolean;
  @Input() canPublish = false;
  @Input() published: boolean;
  @Output() updatedGroup = new EventEmitter<AccordionItem>();
  @Output() deleteGroup = new EventEmitter<AccordionItem>();
  @Input() taskCount: number;
  @Input() isGroupDuplicating = false;
  @Input() isGroupBasedColumn = false;
  @Output() columnAdded = new EventEmitter<unknown>();
  @Output() onDuplicateGroup = new EventEmitter<Item>();
  @Output() moveGroup = new EventEmitter<AccordionItem>();
  @Output() copyGroup = new EventEmitter<AccordionItem>();
  @Output() openForm = new EventEmitter<AccordionItem>();
  @Output() addTask = new EventEmitter<{ groupId: string; index: number }>();
  clickEle: HTMLElement;
  animationSettings = {
    effect: 'None' as Effect,
    duration: 0,
    easing: 'linear',
  };
  @ViewChildren('groupName') groupName: QueryList<ElementRef>;
  @Output() clipboardPaste = new EventEmitter<{ targetGroup: Item }>();
  @Output() onAccordianClick = new EventEmitter<{ groupId: string }>();
  @Input() activeAccordianId: string;
  @Output() expandChange = new EventEmitter<boolean>();
  @Output() expandAllChange = new EventEmitter<boolean>();
  @Output() publish = new EventEmitter();
  @Output() unpublish = new EventEmitter();

  showCollapseAll = false;
  editMode = false;
  created() {
    this.acrdnInstance.animation.expand = this.animationSettings;
  }
}
