import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PercentageTemplateComponent} from './percentage-template.component';

describe('PercentageTemplateComponent', () => {
  let component: PercentageTemplateComponent;
  let fixture: ComponentFixture<PercentageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PercentageTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
