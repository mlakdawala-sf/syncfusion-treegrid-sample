import { Injectable } from '@angular/core';

@Injectable()
export class GridEventService {
  callGridEditSave() {
    const hasId = document.body.hasAttribute('grid-id');
    if (hasId) {
      const id = document.body.getAttribute('grid-id');
      const list: any = document.querySelector('#' + id);
      const grid = list?.ej2_instances[0];
      if (grid?.isEdit) {
        grid?.saveCell();
      }
    }
  }
}
