import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-priority-template]',
  templateUrl: './priority-template.component.html',
  styleUrls: ['./priority-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityTemplateComponent {
  @Input() data: any;
}
