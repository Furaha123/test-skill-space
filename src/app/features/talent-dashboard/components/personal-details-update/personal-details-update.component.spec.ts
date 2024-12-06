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
import { ToastrService } from "ngx-toastr";

describe("PersonalDetailsUpdateComponent", () => {
  let component: PersonalDetailsUpdateComponent;
  let fixture: ComponentFixture<PersonalDetailsUpdateComponent>;
  let talentProfileService: jest.Mocked<TalentProfileService>;
  let toastrService: jest.Mocked<ToastrService>;

  const mockPersonalDetails: PersonalDetails = {
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

    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PersonalDetailsUpdateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: TalentProfileService, useValue: talentProfileServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsUpdateComponent);
    component = fixture.componentInstance;
    talentProfileService = TestBed.inject(
      TalentProfileService,
    ) as jest.Mocked<TalentProfileService>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
  });

  describe("Component Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize form with empty values", () => {
      expect(component.personalDetailsForm.get("firstName")?.value).toBe("");
      expect(component.personalDetailsForm.get("lastName")?.value).toBe("");
      expect(component.socialMediaControls.length).toBe(0);
      expect(component.portfolioControls.length).toBe(0);
    });

    it("should initialize with default values", () => {
      expect(component.selectedIcon).toBe("");
      expect(component.isDropdownOpen).toBeFalsy();
      expect(component.errorMessage).toBe("");
    });
  });

  describe("Form Controls and Validation", () => {
    beforeEach(() => {
      component.personalDetails = mockPersonalDetails;
      fixture.detectChanges();
    });

    it("should validate required fields", () => {
      const requiredFields = [
        "firstName",
        "lastName",
        "introduction",
        "birthDate",
        "nationality",
        "currentLocation",
        "phoneNumber",
      ];

      requiredFields.forEach((field) => {
        const control = component.personalDetailsForm.get(field);
        control?.setValue("");
        expect(control?.errors?.["required"]).toBeTruthy();
      });
    });

    it("should validate introduction length", () => {
      const introductionControl =
        component.personalDetailsForm.get("introduction");
      introductionControl?.setValue("a".repeat(251));
      expect(introductionControl?.errors?.["maxlength"]).toBeTruthy();
    });

    it("should accept valid form values", () => {
      component.personalDetailsForm.patchValue(mockPersonalDetails);
      expect(component.personalDetailsForm.valid).toBeTruthy();
    });
  });

  describe("Social Media Management", () => {
    beforeEach(() => {
      component.personalDetails = mockPersonalDetails;
      fixture.detectChanges();
    });

    it("should add social media entry", () => {
      const initialLength = component.socialMediaControls.length;
      component.addSocialMedia();
      expect(component.socialMediaControls.length).toBe(initialLength + 1);
    });

    it("should remove social media entry", () => {
      component.addSocialMedia();
      const initialLength = component.socialMediaControls.length;
      component.removeSocialMedia(0);
      expect(component.socialMediaControls.length).toBe(initialLength - 1);
    });

    it("should set up social media form array from input", () => {
      component.setUpSocialMediaFormArray();
      expect(component.socialMediaControls.length).toBe(
        mockPersonalDetails.socialMedia.length,
      );
    });

    it("should handle empty social media array", () => {
      component.personalDetails = { ...mockPersonalDetails, socialMedia: [] };
      component.setUpSocialMediaFormArray();
      expect(component.socialMediaControls.length).toBe(0);
    });
  });

  describe("Portfolio Management", () => {
    beforeEach(() => {
      component.personalDetails = mockPersonalDetails;
      fixture.detectChanges();
    });

    it("should add portfolio entry", () => {
      const initialLength = component.portfolioControls.length;
      component.addPortfolio();
      expect(component.portfolioControls.length).toBe(initialLength + 1);
    });

    it("should remove portfolio entry", () => {
      component.addPortfolio();
      const initialLength = component.portfolioControls.length;
      component.removePortfolio(0);
      expect(component.portfolioControls.length).toBe(initialLength - 1);
    });

    it("should set up portfolios form array from input", () => {
      component.setUpPortfoliosFormArray();
      expect(component.portfolioControls.length).toBe(
        mockPersonalDetails.portfolios.length,
      );
    });

    it("should handle empty portfolios array", () => {
      component.personalDetails = { ...mockPersonalDetails, portfolios: [] };
      component.setUpPortfoliosFormArray();
      expect(component.portfolioControls.length).toBe(0);
    });
  });

  describe("File Upload Handling", () => {
    it("should handle valid profile picture upload", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");
      expect(
        component.personalDetailsForm.get("profilePictureUrl")?.value,
      ).toBe(file);
      expect(component.errorMessage).toBe("");
    });

    it("should handle valid CV upload", () => {
      const file = new File([""], "test.pdf", { type: "application/pdf" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "cvUrl");
      expect(component.personalDetailsForm.get("cvUrl")?.value).toBe(file);
      expect(component.errorMessage).toBe("");
    });

    it("should reject oversized files", () => {
      const file = new File([new ArrayBuffer(11 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");
      expect(component.errorMessage).toBe("File size exceeds 10MB limit");
    });

    it("should reject invalid file types", () => {
      const file = new File([""], "test.txt", { type: "text/plain" });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileChange(event, "profilePictureUrl");
      expect(component.errorMessage).toBe(
        "Invalid file type for profile picture",
      );
    });
  });

  describe("Social Media Icon Handling", () => {
    it("should toggle dropdown", () => {
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeTruthy();
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeFalsy();
    });

    it("should select icon and close dropdown", () => {
      component.selectIcon("GitHub");
      expect(component.selectedIcon).toBe("GitHub");
      expect(component.isDropdownOpen).toBeFalsy();
    });

    it("should get correct icon image URL", () => {
      const url = component.getIconImage("LinkedIn");
      expect(url).toBe("assets/icon/social/linkedin.png");
    });

    it("should return undefined for non-existent icon", () => {
      const url = component.getIconImage("NonExistent");
      expect(url).toBeUndefined();
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      component.personalDetails = mockPersonalDetails;
      fixture.detectChanges();
    });

    it("should submit valid form successfully", fakeAsync(() => {
      const response: ApiResponse<PersonalDetails> = {
        status: "success",
        message: "Success",
        data: mockPersonalDetails,
      };
      talentProfileService.updatePersonalDetails.mockReturnValue(of(response));
      const emitSpy = jest.spyOn(component.cancelEdit, "emit");

      component.personalDetailsForm.patchValue(mockPersonalDetails);
      component.onSubmit();
      tick();

      expect(talentProfileService.updatePersonalDetails).toHaveBeenCalledWith(
        component.personalDetailsForm.value,
      );
      expect(toastrService.success).toHaveBeenCalledWith(
        "Personal details updated successfully",
      );
      expect(emitSpy).toHaveBeenCalled();
    }));

    it("should handle invalid form submission", () => {
      component.personalDetailsForm.controls["firstName"].setValue("");
      component.onSubmit();

      expect(talentProfileService.updatePersonalDetails).not.toHaveBeenCalled();
      expect(toastrService.error).toHaveBeenCalledWith(
        "Please fill in all required fields correctly.",
      );
    });

    it("should handle API error during submission", fakeAsync(() => {
      talentProfileService.updatePersonalDetails.mockReturnValue(
        throwError(() => new Error("Update failed")),
      );
      const emitSpy = jest.spyOn(component.cancelEdit, "emit");

      component.personalDetailsForm.patchValue(mockPersonalDetails);
      component.onSubmit();
      tick();

      expect(toastrService.error).toHaveBeenCalledWith(
        "Failed to update personal details",
      );
      expect(emitSpy).toHaveBeenCalled();
    }));
  });

  describe("Data Loading", () => {
    it("should load personal details from API when not provided as input", fakeAsync(() => {
      const response: ApiResponse<PersonalDetails> = {
        status: "success",
        message: "Success",
        data: mockPersonalDetails,
      };
      talentProfileService.getPersonalDetails.mockReturnValue(of(response));

      component.loadPersonalDetails();
      tick();

      expect(component.personalDetailsForm.value.firstName).toBe("John");
      expect(component.personalDetailsForm.value.lastName).toBe("Doe");
    }));
  });

  describe("Component Cleanup", () => {
    it("should complete destroy$ subject on destruction", () => {
      const nextSpy = jest.spyOn(component["destroy$"], "next");
      const completeSpy = jest.spyOn(component["destroy$"], "complete");

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
