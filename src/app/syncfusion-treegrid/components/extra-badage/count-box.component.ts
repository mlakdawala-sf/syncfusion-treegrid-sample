import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
@Component({
  selector: 'rpms-count-box',
  templateUrl: './count-box.component.html',
  styleUrls: ['./count-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountBoxComponent {
  label: string;
  count: number;
  private _datasource: (string | object)[];

  @Input() labelProperty = 'text';
  @Input() icon = '';

  @Input() cssClass = '';
  tooltip: any;
  @Input('dataset') set datasource(values: (string | object)[]) {
    this._datasource = values;
    if (values && values.length) {
      this.count = Math.max(values.length - 1, 0);
      if (typeof values[0] === 'string') {
        this.label = values[0];
        this.tooltip = values.slice(1, values.length).join(', ');
      } else if (
        values[0] &&
        typeof (values as any)[0][this.labelProperty] === 'string'
      ) {
        this.label = (values as any)[0][this.labelProperty];
        this.tooltip = values
          .slice(1, values.length)
          .map(e => (e as any)[this.labelProperty])
          .join(', ');
      } else {
        this.label = '';
      }
    }
  }
  get datasource() {
    return this._datasource;
  }
  constructor() {
    this.label = '';
    this.count = 0;
  }
}
