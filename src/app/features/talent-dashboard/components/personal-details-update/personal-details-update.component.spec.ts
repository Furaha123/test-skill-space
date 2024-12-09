import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { TalentProfileService } from "../../services/talent-profile.service";
import { PersonalDetailsUpdateComponent } from "./personal-details-update.component";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ApiResponse,
  PersonalDetails,
} from "../../models/personal.detalis.interface";

describe("PersonalDetailsUpdateComponent", () => {
  let component: PersonalDetailsUpdateComponent;
  let fixture: ComponentFixture<PersonalDetailsUpdateComponent>;
  let talentProfileService: jest.Mocked<TalentProfileService>;

  const personalDetails: PersonalDetails = {
    firstName: "John",
    lastName: "Doe",
    introduction: "Hello, I am John Doe.",
    birthDate: "1990-01-01",
    nationality: "American",
    currentLocation: "New York, USA",
    phoneNumber: "+123456789",
    phoneVisibility: "public",
    socialMedia: [{ name: "LinkedIn", url: "http://linkedin.com/johndoe" }],
    profilePictureUrl: "http://example.com/profile.jpg",
    cvUrl: "http://example.com/cv.pdf",
    portfolios: ["http://example.com/portfolio1"],
  };

  beforeEach(async () => {
    const talentProfileServiceMock = {
      getPersonalDetails: jest.fn(),
      updatePersonalDetails: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PersonalDetailsUpdateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: TalentProfileService, useValue: talentProfileServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsUpdateComponent);
    component = fixture.componentInstance;
    talentProfileService = TestBed.inject(
      TalentProfileService,
    ) as jest.Mocked<TalentProfileService>;
  });

  describe("Basic Component Functionality", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should emit cancelEdit on cancel", () => {
      const emitSpy = jest.spyOn(component.cancelEdit, "emit");
      component.onCancel();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe("Initialization and Data Loading", () => {
    it("should initialize with provided personal details", () => {
      component.personalDetails = personalDetails;
      fixture.detectChanges();

      expect(component.personalDetailsForm.value.firstName).toBe("John");
      expect(component.personalDetailsForm.value.lastName).toBe("Doe");
      expect(component.socialMediaControls.length).toBe(1);
      expect(component.portfolioControls.length).toBe(1);
    });

    it("should fetch personal details if not provided", fakeAsync(() => {
      const mockResponse: ApiResponse<PersonalDetails> = {
        status: "success",
        message: "",
        data: personalDetails,
      };
      talentProfileService.getPersonalDetails.mockReturnValue(of(mockResponse));

      fixture.detectChanges();
      tick();

      expect(talentProfileService.getPersonalDetails).toHaveBeenCalled();
      expect(component.personalDetailsForm.value.firstName).toBe("John");
    }));
  });

  describe("Form Arrays Management", () => {
    beforeEach(() => {
      component.personalDetails = personalDetails;
      fixture.detectChanges();
    });

    it("should add and remove social media entries", () => {
      expect(component.socialMediaControls.length).toBe(1);

      component.addSocialMedia();
      expect(component.socialMediaControls.length).toBe(2);

      component.removeSocialMedia(1);
      expect(component.socialMediaControls.length).toBe(1);
    });

    it("should add and remove portfolio entries", () => {
      expect(component.portfolioControls.length).toBe(1);

      component.addPortfolio();
      expect(component.portfolioControls.length).toBe(2);

      component.removePortfolio(1);
      expect(component.portfolioControls.length).toBe(1);
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      component.personalDetails = personalDetails;
      fixture.detectChanges();
    });

    it("should validate required fields", () => {
      const form = component.personalDetailsForm;
      form.patchValue({
        firstName: "",
        lastName: "",
        introduction: "",
      });

      expect(form.valid).toBeFalsy();
      expect(form.controls["firstName"].errors?.["required"]).toBeTruthy();
      expect(form.controls["lastName"].errors?.["required"]).toBeTruthy();
      expect(form.controls["introduction"].errors?.["required"]).toBeTruthy();
    });

    it("should validate introduction length", () => {
      const form = component.personalDetailsForm;
      form.patchValue({
        introduction: "a".repeat(251),
      });

      expect(form.controls["introduction"].errors?.["maxlength"]).toBeTruthy();
    });
  });

  describe("File Upload Handling", () => {
    beforeEach(() => {
      component.personalDetails = personalDetails;
      fixture.detectChanges();
    });

    it("should handle valid profile picture upload", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");

      expect(component.errorMessage).toBe("");
      expect(
        component.personalDetailsForm.get("profilePictureUrl")?.value,
      ).toBe(file);
    });

    it("should handle valid CV upload", () => {
      const file = new File([""], "test.pdf", { type: "application/pdf" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "cvUrl");

      expect(component.errorMessage).toBe("");
      expect(component.personalDetailsForm.get("cvUrl")?.value).toBe(file);
    });

    it("should handle invalid file type for profile picture", () => {
      const file = new File([""], "test.txt", { type: "text/plain" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");

      expect(component.errorMessage).toBe(
        "Invalid file type for profile picture",
      );
    });

    it("should handle invalid file type for CV", () => {
      const file = new File([""], "test.txt", { type: "text/plain" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "cvUrl");

      expect(component.errorMessage).toBe("Invalid file type for CV");
    });

    it("should handle file size exceeding limit", () => {
      const largeFile = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        "large.jpg",
        {
          type: "image/jpeg",
        },
      );
      const event = { target: { files: [largeFile] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");

      expect(component.errorMessage).toBe("File size exceeds 10MB limit");
    });

    it("should handle empty file selection", () => {
      const event = { target: { files: [] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");

      expect(
        component.personalDetailsForm.get("profilePictureUrl")?.value,
      ).toBe(personalDetails.profilePictureUrl);
    });
  });

  describe("Social Media Icon Handling", () => {
    beforeEach(() => {
      component.personalDetails = personalDetails;
      fixture.detectChanges();
    });

    it("should toggle dropdown", () => {
      expect(component.isDropdownOpen).toBeFalsy();

      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeTruthy();

      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeFalsy();
    });

    it("should select icon and close dropdown", () => {
      component.isDropdownOpen = true;
      component.selectIcon("GitHub");

      expect(component.selectedIcon).toBe("GitHub");
      expect(component.isDropdownOpen).toBeFalsy();
    });

    it("should get correct icon image", () => {
      expect(component.getIconImage("LinkedIn")).toBe(
        "assets/icon/social/linkedin.png",
      );
      expect(component.getIconImage("GitHub")).toBe(
        "assets/icon/social/github.png",
      );
      expect(component.getIconImage("NonExistent")).toBeUndefined();
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      component.personalDetails = personalDetails;
      fixture.detectChanges();
    });

    it("should submit valid form successfully", fakeAsync(() => {
      const response: ApiResponse<PersonalDetails> = {
        status: "success",
        message: "",
        data: personalDetails,
      };
      talentProfileService.updatePersonalDetails.mockReturnValue(of(response));
      const emitSpy = jest.spyOn(component.cancelEdit, "emit");

      component.personalDetailsForm.patchValue(personalDetails);
      component.onSubmit();
      tick();

      expect(talentProfileService.updatePersonalDetails).toHaveBeenCalledWith(
        component.personalDetailsForm.value,
      );
      expect(emitSpy).toHaveBeenCalled();
      expect(component.errorMessage).toBe("");
    }));

    it("should handle invalid form submission", () => {
      component.personalDetailsForm.controls["firstName"].setValue("");
      component.onSubmit();

      expect(talentProfileService.updatePersonalDetails).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe(
        "Please fill in all required fields correctly.",
      );
    });

    it("should handle error during form submission", fakeAsync(() => {
      talentProfileService.updatePersonalDetails.mockReturnValue(
        throwError(() => new Error("Update failed")),
      );
      const emitSpy = jest.spyOn(component.cancelEdit, "emit");

      component.personalDetailsForm.patchValue(personalDetails);
      component.onSubmit();
      tick();

      expect(component.errorMessage).toBe("Failed to update personal details");
      expect(emitSpy).toHaveBeenCalled();
    }));
  });

  describe("Component Cleanup", () => {
    it("should complete destroy$ subject on component destruction", () => {
      const nextSpy = jest.spyOn(component["destroy$"], "next");
      const completeSpy = jest.spyOn(component["destroy$"], "complete");

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
