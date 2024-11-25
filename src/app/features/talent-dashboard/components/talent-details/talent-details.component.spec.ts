import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TalentDetailsComponent } from "./talent-details.component";
import { TalentProfileService } from "../../services/talent-profile.service";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { PersonalDetails } from "../../models/personal.detalis.interface";

class MockTalentProfileService {
  getPersonalDetails() {
    return of({
      introduction: "Test introduction",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01",
      nationality: "American",
      currentLocation: "New York",
      phoneNumber: "123-456-7890",
      phoneVisibility: true,
      socialMedia: [],
      profilePictureUrl: null,
      cvUrl: null,
      portfolios: [],
    } as PersonalDetails);
  }
}

class MockToastrService {
  success() {}
  error() {}
}

describe("TalentDetailsComponent", () => {
  let component: TalentDetailsComponent;
  let fixture: ComponentFixture<TalentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [TalentDetailsComponent],
      providers: [
        { provide: TalentProfileService, useClass: MockTalentProfileService },
        { provide: ToastrService, useClass: MockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form", () => {
    component.ngOnInit();
    expect(component.profileForm).toBeDefined();
    expect(component.socialMediaLinks).toBeDefined();
    expect(component.portfolioLinks).toBeDefined();
  });

  it("should toggle dropdown", () => {
    component.isDropdownOpen = false;
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(true);
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(false);
  });

  it("should select icon", () => {
    component.selectIcon("Twitter");
    expect(component.selectedIcon).toBe("Twitter");
    expect(component.isDropdownOpen).toBe(false);
  });

  it("should update word count and introduction text on text change", () => {
    const event = {
      target: { value: "New introduction text" },
    } as unknown as Event;

    component.onTextChange(event);
    expect(component.wordCount).toBe(3);
    expect(component.introductionText).toBe("New introduction text");
  });

  it("should handle error when fetching personal details", () => {
    const errorResponse = new Error("Failed to fetch");
    jest
      .spyOn(MockTalentProfileService.prototype, "getPersonalDetails")
      .mockReturnValue(throwError(() => errorResponse));
    const toastrErrorSpy = jest.spyOn(MockToastrService.prototype, "error");

    component.ngOnInit();
    component.personalDetails$?.subscribe({
      error: () => {
        expect(toastrErrorSpy).toHaveBeenCalledWith(
          "Failed to fetch personal details",
          "Error",
        );
      },
    });
  });
});
