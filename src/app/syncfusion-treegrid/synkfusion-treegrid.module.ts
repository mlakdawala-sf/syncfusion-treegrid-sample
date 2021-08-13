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
import { TaskAdapterService } from './services/task-adapter.service';

import { SynkfusionTreeGridComponent } from './syncfusion-treegrid.component';

const synkfusionModules = [
  NumericTextBoxAllModule,
  DialogModule,
  DatePickerAllModule,
  DropDownListAllModule,
  CheckBoxModule,
  DateRangePickerModule,
];

@NgModule({
  declarations: [SynkfusionTreeGridComponent],
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
  ],
  exports: [
    SynkfusionTreeGridComponent,
    ...synkfusionModules,
    TreeGridAllModule,
  ],
})
export class SynkFusionTreeGridModule {}
