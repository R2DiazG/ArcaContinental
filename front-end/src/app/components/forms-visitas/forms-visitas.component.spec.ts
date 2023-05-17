import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsVisitasComponent } from './forms-visitas.component';

describe('FormsVisitasComponent', () => {
  let component: FormsVisitasComponent;
  let fixture: ComponentFixture<FormsVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsVisitasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
