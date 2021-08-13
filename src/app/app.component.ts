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

        editType: 'templateedit',

        id: 'name' + index,
        allowEditing: true,
        width: 200,
        minWidth: 200,
        allowReordering: false,
        headerText: 'Items',
      });
    }
    this.columns = columns;
  }
}
