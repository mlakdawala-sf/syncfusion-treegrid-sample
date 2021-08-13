import { Injectable } from '@angular/core';

@Injectable()
export class TaskAdapterService {
  adaptToModel(res: any): any {
    const task: any = {};
    task.id = res.id;
    task.groupId = res.groupId;
    task.boardId = res.boardId;
    task.parentTaskId = res.parentTaskId;
    task.sequenceNumber = res.sequenceNumber;
    task.metaData = res.metaData;
    task.itemPermission = res?.boardTaskPermissions;

    task.name = res.name;
    task.description = res.description;
    task.taskColumnValues = res.taskColumnValues;
    task.taskFilesCount = res.taskFilesCount;
    task.taskUpdatesCount = res.taskUpdatesCount;
    task.proofFilesCount = res.proofFilesCount;
    task.messages = res.messages;
    task.modifiedOn = res.modifiedOn;
    task.modifiedBy = res.modifiedBy;
    task.expanded = true;
    if (!res.fieldValues) {
      task.fieldValues = {};
    } else {
      task.fieldValues = res.fieldValues;
    }
    task.fieldValues['name'] = {
      value: { value: res.name, displayValue: res.name },
      key: 'name',
    };
    task.fieldValues['id'] = {
      value: task.id,
      key: 'id',
    };
    if (res.taskColumnValues) {
      res.taskColumnValues.forEach((element: any) => {
        if (!element.value) {
          element.value = { value: '' };
        }
        const value = task.fieldValues[element.columnId];
        task.fieldValues[element.columnId] = {
          id: element.id,
          columnId: element.columnId,
          taskId: res.id,
          value: value?.value ? value.value : element.value,
          key: element.id,
          kanbanSequenceNumber: element.kanbanSequenceNumber,
        };
      });
    }
    task.createdOn = res.createdOn;
    task.depth = res.depth;
    task.linksInfo = res.linksInfo;
    if (res.subTasks?.length) {
      const subTasks: any[] = [];
      for (const subTask of res.subTasks) {
        subTasks.push(this.adaptToModel(subTask));
      }
      task.subTasks = subTasks;
    }
    return task;
  }
}
