// layout.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LayoutComponent } from "./layout.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("LayoutComponent", () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with minimized as false", () => {
    expect(component.minimized).toBe(false);
  });

  it("should initialize with selectedIndex as 0", () => {
    expect(component.selectedIndex).toBe(0);
  });

  it("should initialize with selectedSetting as false", () => {
    expect(component.selectedSetting).toBe(false);
  });

  it("should toggle minimized state when toggleNav is called", () => {
    component.toggleNav();
    expect(component.minimized).toBe(true);
    component.toggleNav();
    expect(component.minimized).toBe(false);
  });

  it("should set selectedIndex and deselect settings when selectItem is called", () => {
    component.selectItem(2);
    expect(component.selectedIndex).toBe(2);
    expect(component.selectedSetting).toBe(false);
  });

  it("should set selectedSetting and deselect other items when selectSettings is called", () => {
    component.selectSettings();
    expect(component.selectedSetting).toBe(true);
    expect(component.selectedIndex).toBe(-1);
  });

  it("should use sidebarItems as default items input", () => {
    expect(component.items).toEqual([
      {
        label: "Dashboard",
        icon: "assets/icon/dashboard.svg",
        route: "/dashboard",
      },
      {
        label: "Programs",
        icon: "assets/icon/program.svg",
        route: "/programs",
      },
      {
        label: "Applications",
        icon: "assets/icon/application.svg",
        route: "/applications",
      },
      {
        label: "Assessments",
        icon: "assets/icon/assessment.svg",
        route: "/assessments",
      },
      {
        label: "Messages",
        icon: "assets/icon/message.svg",
        route: "/messages",
      },
    ]);
  });
});
