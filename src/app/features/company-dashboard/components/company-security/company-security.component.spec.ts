import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanySecurityComponent } from "./company-security.component";

describe("CompanySecurityComponent", () => {
  let component: CompanySecurityComponent;
  let fixture: ComponentFixture<CompanySecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanySecurityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
