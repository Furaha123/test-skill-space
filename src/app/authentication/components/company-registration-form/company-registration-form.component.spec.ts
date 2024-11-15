import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanyRegistrationFormComponent } from "./company-registration-form.component";

describe("CompanyRegistrationFormComponent", () => {
  let component: CompanyRegistrationFormComponent;
  let fixture: ComponentFixture<CompanyRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyRegistrationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
