import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanyVerificationPageComponent } from "./company-verification-page.component";

describe("CompanyVerificationPageComponent", () => {
  let component: CompanyVerificationPageComponent;
  let fixture: ComponentFixture<CompanyVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyVerificationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
