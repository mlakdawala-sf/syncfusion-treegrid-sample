import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-percentage-template]',
  templateUrl: './percentage-template.component.html',
  styleUrls: ['./percentage-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentageTemplateComponent {
  @Input() data: any;
}
