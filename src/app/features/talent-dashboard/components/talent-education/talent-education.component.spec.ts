import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TalentEducationComponent } from "./talent-education.component";

describe("TalentEducationComponent", () => {
  let component: TalentEducationComponent;
  let fixture: ComponentFixture<TalentEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalentEducationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
