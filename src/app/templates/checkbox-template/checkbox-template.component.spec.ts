import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckboxTemplateComponent} from './checkbox-template.component';

describe('CheckboxTemplateComponent', () => {
  let component: CheckboxTemplateComponent;
  let fixture: ComponentFixture<CheckboxTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
