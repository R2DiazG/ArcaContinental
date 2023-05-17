import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreregistroComponent } from '../preregistro/preregistro.component';

describe('PreregistroComponent', () => {
  let component: PreregistroComponent;
  let fixture: ComponentFixture<PreregistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreregistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
