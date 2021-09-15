import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SynkFusionTreeGridModule } from './syncfusion-treegrid/synkfusion-treegrid.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CurrencyTemplateComponent } from './templates/currency-template/currency-template.component';
import { DateTemplateComponent } from './templates/date-template/date-template.component';
import { DateTimeTemplateComponent } from './templates/date-time-template/date-time-template.component';
import { DropdownTemplateComponent } from './templates/dropdown-template/dropdown-template.component';
import { NumberTemplateComponent } from './templates/number-template/number-template.component';

import { PercentageTemplateComponent } from './templates/percentage-template/percentage-template.component';
import { PriorityTemplateComponent } from './templates/priority-template/priority-template.component';
import { StatusTemplateComponent } from './templates/status-template/status-template.component';
import { TaskLabelTemplateComponent } from './templates/task-label-template/task-label-template.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BoardColumnAdapter } from './syncfusion-treegrid/services/board-column-adapter.service';
import { GroupAdapter } from './syncfusion-treegrid/services/group-adapter.service';
import { ConditionalFormattingDirective } from './syncfusion-treegrid/directives/conditional-formatting.directive';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { CheckboxTemplateComponent } from './templates/checkbox-template/checkbox-template.component';
import { CountBoxComponent } from './syncfusion-treegrid/components/extra-badage/count-box.component';

const components = [
  DateTemplateComponent,
  DateTimeTemplateComponent,
  CurrencyTemplateComponent,
  // CheckBoxComponent,
  CheckboxTemplateComponent,
  PercentageTemplateComponent,
  NumberTemplateComponent,
  DropdownTemplateComponent,
  StatusTemplateComponent,
  TaskLabelTemplateComponent,
  PriorityTemplateComponent,
  // CountBoxComponent,
];
const matModules = [
  MatSidenavModule,
  MatMenuModule,
  MatCardModule,
  MatPaginatorModule,
  MatTableModule,
  MatButtonModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatSelectModule,
  MatChipsModule,
  MatExpansionModule,

  MatDatepickerModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatTabsModule,
  MatDialogModule,

  MatProgressBarModule,
  MatTooltipModule,
  MatBadgeModule,
  MatMenuModule,
];
@NgModule({
  declarations: [AppComponent, ...components, ConditionalFormattingDirective],
  imports: [
    BrowserModule,
    SynkFusionTreeGridModule,
    BrowserAnimationsModule,
    ...matModules,
  ],
  providers: [BoardColumnAdapter, GroupAdapter],
  bootstrap: [AppComponent],
  exports: [
    ConditionalFormattingDirective,
    // CheckBoxComponent,
    // CountBoxComponent,
  ],
})
export class AppModule {}
