import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskLabelTemplateComponent} from './task-label-template.component';

describe('TaskLabelTemplateComponent', () => {
  let component: TaskLabelTemplateComponent;
  let fixture: ComponentFixture<TaskLabelTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskLabelTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLabelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
