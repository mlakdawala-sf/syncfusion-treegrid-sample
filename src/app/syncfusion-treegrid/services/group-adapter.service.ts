import { Injectable } from '@angular/core';

@Injectable()
export class GroupAdapter {
  adaptToModel(resp: any): any {
    if (resp) {
      resp['visibility'] = true;
      resp.expanded = true;
      resp.metaData = resp.metaData || {};
    }
    return resp;
  }

  adaptFromModel(data: any) {
    let req: any = {};
    req.name = data.name;
    req.description = data.description ?? 'Adding Groups';
    req.archived = data.archived ?? false;
    req.color = data.color ?? '#008CFF';
    req.sequenceNumber = data.sequenceNumber ?? 0;
    req.boardId = data.boardId;
    req.metaData = data.metaData || {};
    req.groupType = data?.groupType;
    return req;
  }
}
