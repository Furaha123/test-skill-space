import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegisterSuccessComponent } from './company-register-success.component';

describe('CompanyRegisterSuccessComponent', () => {
  let component: CompanyRegisterSuccessComponent;
  let fixture: ComponentFixture<CompanyRegisterSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyRegisterSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRegisterSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
