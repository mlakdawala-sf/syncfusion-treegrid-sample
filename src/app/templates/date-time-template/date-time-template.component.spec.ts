import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateTimeTemplateComponent} from './date-time-template.component';

describe('DateTimeTemplateComponent', () => {
  let component: DateTimeTemplateComponent;
  let fixture: ComponentFixture<DateTimeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateTimeTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
