import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTabsModule } from "@angular/material/tabs";
import { CompanyProfileComponent } from "./company-profile.component";

import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";

// Create mock components to avoid dependency issues
@Component({
  selector: "app-company-details",
  template: "",
})
class MockCompanyDetailsComponent {}

@Component({
  selector: "app-company-security",
  template: "",
})
class MockCompanySecurityComponent {}

describe("CompanyProfileComponent", () => {
  let component: CompanyProfileComponent;
  let fixture: ComponentFixture<CompanyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompanyProfileComponent,
        MockCompanyDetailsComponent,
        MockCompanySecurityComponent,
      ],
      imports: [MatTabsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should change tab index when onTabChange is called", () => {
    component.onTabChange(1);
    expect(component.selectedTabIndex).toBe(1);
  });

  it("should render two tab labels", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const tabLabels = fixture.debugElement.queryAll(By.css(".mdc-tab"));
    expect(tabLabels.length).toBe(2);
  });
});
