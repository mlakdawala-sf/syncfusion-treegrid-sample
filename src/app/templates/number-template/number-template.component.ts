import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-number-template]',
  templateUrl: './number-template.component.html',
  styleUrls: ['./number-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberTemplateComponent {
  @Input() data: any;
}
