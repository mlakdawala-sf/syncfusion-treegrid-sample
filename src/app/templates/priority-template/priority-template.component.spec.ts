import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PriorityTemplateComponent} from './priority-template.component';

describe('PriorityTemplateComponent', () => {
  let component: PriorityTemplateComponent;
  let fixture: ComponentFixture<PriorityTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriorityTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
