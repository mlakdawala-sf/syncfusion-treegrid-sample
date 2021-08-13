import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrencyTemplateComponent} from './currency-template.component';

describe('CurrencyTemplateComponent', () => {
  let component: CurrencyTemplateComponent;
  let fixture: ComponentFixture<CurrencyTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
