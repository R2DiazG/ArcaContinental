import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrGuardiaComponent } from './qr-guardia.component';

describe('QrGuardiaComponent', () => {
  let component: QrGuardiaComponent;
  let fixture: ComponentFixture<QrGuardiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrGuardiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
