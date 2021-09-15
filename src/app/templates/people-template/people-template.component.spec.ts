import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeopleTemplateComponent} from './people-template.component';

describe('PeopleTemplateComponent', () => {
  let component: PeopleTemplateComponent;
  let fixture: ComponentFixture<PeopleTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
