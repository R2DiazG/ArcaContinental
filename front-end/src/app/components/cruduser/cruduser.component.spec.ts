import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CruduserComponent } from './cruduser.component';

describe('CruduserComponent', () => {
  let component: CruduserComponent;
  let fixture: ComponentFixture<CruduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CruduserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CruduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
