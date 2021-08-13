import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropdownTemplateComponent} from './dropdown-template.component';

describe('DropdownTemplateComponent', () => {
  let component: DropdownTemplateComponent;
  let fixture: ComponentFixture<DropdownTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
