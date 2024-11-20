import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardTalentComponent } from "./dashboard-talent.component";

describe("DashboardTalentComponent", () => {
  let component: DashboardTalentComponent;
  let fixture: ComponentFixture<DashboardTalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardTalentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
