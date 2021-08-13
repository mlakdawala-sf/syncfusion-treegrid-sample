import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'grid-render';

  columns: any[];
  constructor(private readonly cd: ChangeDetectorRef) {}
  @ViewChild('textTemplate', { read: TemplateRef })
  public textTemplate: NgModel;

  ngAfterViewInit() {
    const columns = [];

    for (let index = 0; index < 20; index++) {
      columns.push({
        columnType: 'text',
        template: this.textTemplate,
        edit: this.textTemplate,
        editType: 'templateedit',

        id: 'name',
        allowEditing: true,
        width: 100,
        minWidth: '100',
        allowReordering: false,
        headerText: 'Items',
      });
    }
    this.columns = columns;
  }
}
