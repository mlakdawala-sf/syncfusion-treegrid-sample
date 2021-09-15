import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-people-template]',
  templateUrl: './people-template.component.html',
  styleUrls: ['./people-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleTemplateComponent {
  @Input() data: any;
}
