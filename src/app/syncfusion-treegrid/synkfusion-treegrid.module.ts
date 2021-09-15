import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import {
  DatePickerAllModule,
  DateRangePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import {
  EditService,
  ResizeService,
  SelectionService,
  TreeGridModule,
  VirtualScrollService,
  TreeGridAllModule,
  RowDDService,
} from '@syncfusion/ej2-angular-treegrid';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { CountBoxComponent } from './components/extra-badage/count-box.component';
import { ConditionalFormattingService } from './services/conditional-formatting.service';
import { GridEventService } from './services/grid-event.service';
import { TaskAdapterService } from './services/task-adapter.service';

import { SynkfusionTreeGridComponent } from './syncfusion-treegrid.component';
import { SyncfusionGenericUtilityService } from './utils/syncfusion-generic-utility.service';
import { TreeGridUtilityService } from './utils/syncfusion-tree-grid-utility.service';

const synkfusionModules = [
  NumericTextBoxAllModule,
  DialogModule,
  DatePickerAllModule,
  DropDownListAllModule,
  CheckBoxModule,
  DateRangePickerModule,
];

@NgModule({
  declarations: [
    SynkfusionTreeGridComponent,
    CheckBoxComponent,
    CountBoxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    TreeGridAllModule,
    ...synkfusionModules,
    TreeGridModule,
  ],
  providers: [
    EditService,
    ResizeService,
    SelectionService,
    VirtualScrollService,
    RowDDService,
    TaskAdapterService,
    SyncfusionGenericUtilityService,
    TreeGridUtilityService,
    GridEventService,
    ConditionalFormattingService,
  ],
  exports: [
    SynkfusionTreeGridComponent,
    ...synkfusionModules,
    TreeGridAllModule,
    CheckBoxComponent,
    CountBoxComponent,
  ],
})
export class SynkFusionTreeGridModule {}
