import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
/* tslint:disable:component-selector */

@Component({
  selector: '[rpms-date-time-template]',
  templateUrl: './date-time-template.component.html',
  styleUrls: ['./date-time-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeTemplateComponent {
  @Input() data: any;
}
