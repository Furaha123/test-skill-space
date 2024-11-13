import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanyApprovalComponent } from "./company-approval.component";

describe("CompanyApprovalComponent", () => {
  let component: CompanyApprovalComponent;
  let fixture: ComponentFixture<CompanyApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyApprovalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
