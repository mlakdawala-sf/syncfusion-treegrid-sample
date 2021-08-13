import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberTemplateComponent} from './number-template.component';

describe('NumberTemplateComponent', () => {
  let component: NumberTemplateComponent;
  let fixture: ComponentFixture<NumberTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
