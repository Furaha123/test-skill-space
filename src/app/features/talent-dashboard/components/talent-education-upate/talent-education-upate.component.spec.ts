import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TalentEducationUpateComponent } from "./talent-education-upate.component";

describe("TalentEducationUpateComponent", () => {
  let component: TalentEducationUpateComponent;
  let fixture: ComponentFixture<TalentEducationUpateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalentEducationUpateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentEducationUpateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
