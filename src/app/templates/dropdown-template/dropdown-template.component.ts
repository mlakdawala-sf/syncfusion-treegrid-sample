import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-dropdown-template]',
  templateUrl: './dropdown-template.component.html',
  styleUrls: ['./dropdown-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownTemplateComponent {
  @Input() data: any;
}
