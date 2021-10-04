import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ColumnMessage } from './column-message-type.model';

@Injectable()
export class ColumnMessageService {
  private readonly subject = new Subject<ColumnMessage>();

  sendMessage(message: ColumnMessage) {
    this.subject.next(message);
  }

  getMessage(): Observable<ColumnMessage> {
    return this.subject.asObservable();
  }
}
