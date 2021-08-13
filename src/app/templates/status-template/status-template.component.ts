import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-status-template]',
  templateUrl: './status-template.component.html',
  styleUrls: ['./status-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTemplateComponent {
  @Input() data: any;
}
