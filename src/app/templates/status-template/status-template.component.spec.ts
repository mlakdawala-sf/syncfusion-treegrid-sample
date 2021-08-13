import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatusTemplateComponent} from './status-template.component';

describe('StatusTemplateComponent', () => {
  let component: StatusTemplateComponent;
  let fixture: ComponentFixture<StatusTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
