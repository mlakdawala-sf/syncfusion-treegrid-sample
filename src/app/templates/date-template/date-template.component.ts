import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-date-template]',
  templateUrl: './date-template.component.html',
  styleUrls: ['./date-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DateTemplateComponent {
  @Input() data: any;
}
