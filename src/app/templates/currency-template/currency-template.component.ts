import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: '[rpms-currency-template]',
  templateUrl: './currency-template.component.html',
  styleUrls: ['./currency-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyTemplateComponent {
  @Input() data: any;
  amount: any;
  ngOnInit() {
    this.amount = this.data.fieldValues[this.data.column.field]?.value?.value;
    this.amount = this.amount?.toLocaleString('en', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
