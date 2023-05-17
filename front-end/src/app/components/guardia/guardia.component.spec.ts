import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiaComponent } from './guardia.component';

describe('GuardiaComponent', () => {
  let component: GuardiaComponent;
  let fixture: ComponentFixture<GuardiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuardiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
