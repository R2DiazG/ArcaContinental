import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoVisitanteComponent } from './nuevo-visitante.component';

describe('NuevoVisitanteComponent', () => {
  let component: NuevoVisitanteComponent;
  let fixture: ComponentFixture<NuevoVisitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoVisitanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
