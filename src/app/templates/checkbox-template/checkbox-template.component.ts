import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export enum SymbolKey {
  Flag = 'flag',
  Checkbox = 'checkbox',
  Star = 'star',
}

export enum SymbolLabel {
  Flag = 'Flag',
  Checkbox = 'Checkbox',
  Star = 'Star',
}

export enum SymbolIcon {
  Flag = 'icomoon flag pre-icon',
  Checkbox = 'icomoon Checkbox pre-icon',
  Star = 'icomoon star-symbol pre-icon',
}

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-checkbox-template]',
  templateUrl: './checkbox-template.component.html',
  styleUrls: ['./checkbox-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxTemplateComponent {
  @Input() data: any;
  @Input() hasPermission: any;
  @Output() checkboxChangeEmitter = new EventEmitter();
  symbolKey = SymbolKey;
}
