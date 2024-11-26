/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormArray,
  FormControl,
} from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TalentDetailsComponent } from "./talent-details.component";
import { TalentProfileService } from "../../services/talent-profile.service";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { PersonalDetails } from "../../models/personal.detalis.interface";
import { HttpErrorResponse } from "@angular/common/http";

class MockTalentProfileService {
  getPersonalDetails() {
    return of({
      firstName: "John",
      lastName: "Doe",
      introduction: "Test introduction",
      birthDate: "1990-01-01",
      nationality: "American",
      currentLocation: "New York",
      phoneNumber: "123-456-7890",
      phoneVisibility: "public",
      socialMedia: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/johndoe" },
        { name: "Twitter", url: "https://twitter.com/johndoe" },
        { name: "GitHub", url: "https://github.com/johndoe" },
      ],
      profilePicture: "https://example.com/images/john_doe_profile.jpg",
      cvUrl: "https://example.com/documents/john_doe_cv.pdf",
      portfolios: [
        { url: "https://example.com/portfolio1" },
        { url: "https://example.com/portfolio2" },
      ],
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
  let mockTalentProfileService: MockTalentProfileService;

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
    mockTalentProfileService = TestBed.inject(
      TalentProfileService,
    ) as MockTalentProfileService;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form", () => {
    component.ngOnInit();
    expect(component.profileForm).toBeDefined();
    expect(component.socialMedia).toBeDefined();
    expect(component.portfolioLinks).toBeDefined();
  });

  it("should populate portfolio links", () => {
    const portfolios = [
      { url: "https://example.com/portfolio1" },
      { url: "https://example.com/portfolio2" },
    ];

    component.populatePortfolioLinks(portfolios);
    expect(component.portfolioLinks.length).toBe(2);
    expect(component.portfolioLinks.at(0).get("url")?.value).toBe(
      portfolios[0].url,
    );
    expect(component.portfolioLinks.at(1).get("url")?.value).toBe(
      portfolios[1].url,
    );
  });

  it("should add social media link", () => {
    while (component.socialMedia.length !== 0) {
      component.socialMedia.removeAt(0);
    }

    component.addSocialMedia();
    expect(component.socialMedia.length).toBe(1);
    component.addSocialMedia();
    expect(component.socialMedia.length).toBe(2);
  });

  it("should validate file type", () => {
    const validImageFile = new File([""], "image.jpg", { type: "image/jpeg" });
    const invalidFile = new File([""], "file.txt", { type: "text/plain" });

    expect(component.isValidFileType(validImageFile, "image")).toBeTruthy();
    expect(component.isValidFileType(invalidFile, "image")).toBeFalsy();
  });

  it("should validate file size", () => {
    const validFile = new File(["a".repeat(4 * 1024 * 1024)], "file.jpg", {
      type: "image/jpeg",
    });

    const invalidFile = new File(["a".repeat(6 * 1024 * 1024)], "file.jpg", {
      type: "image/jpeg",
    });

    expect(component.isValidFileSize(validFile)).toBeTruthy();
    expect(component.isValidFileSize(invalidFile)).toBeFalsy();
  });

  it("should create file preview", () => {
    const file = new File([""], "file.jpg", { type: "image/jpeg" });
    const readerSpy = jest.spyOn(FileReader.prototype, "readAsDataURL");

    component.createFilePreview(file);
    expect(readerSpy).toHaveBeenCalledWith(file);
  });

  it("should handle file selection", () => {
    const file = new File(["a".repeat(1024)], "image.jpg", {
      type: "image/jpeg",
    });
    const event = { target: { files: [file] } };

    const createFilePreviewSpy = jest.spyOn(component, "createFilePreview");
    component.onFileSelected(event, "image");
    expect(createFilePreviewSpy).toHaveBeenCalledWith(file);
    expect(component.profileForm.get("profilePicture")?.value).toBe(file);
  });

  it("should handle error when fetching talent details", () => {
    jest
      .spyOn(mockTalentProfileService, "getPersonalDetails")
      .mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({ error: "Error fetching talent details" }),
        ),
      );
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    component.fetchTalentDetails();
    fixture.detectChanges();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching talent details:",
      expect.any(HttpErrorResponse),
    );
  });

  it("should create file preview and set imagePreviewUrl", (done) => {
    const file = new File(["sample content"], "sample.jpg", {
      type: "image/jpeg",
    });

    const mockFileReader = {
      result: "data:image/jpeg;base64,samplebase64data",
      onload: null as
        | ((this: FileReader, ev: ProgressEvent<FileReader>) => any)
        | null,
      readAsDataURL: jest.fn(function (this: FileReader) {
        if (this.onload) {
          const event: Partial<ProgressEvent<FileReader>> = {
            target: { result: this.result } as FileReader,
          };
          this.onload(event as ProgressEvent<FileReader>);
        }
      }),
    };

    // Spy on window.FileReader and return the mock
    jest
      .spyOn(window as any, "FileReader")
      .mockImplementation(() => mockFileReader as unknown as FileReader);

    // Call the method
    component.createFilePreview(file);

    // Verify that the readAsDataURL method was called with the file
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);

    // Verify the imagePreviewUrl is set
    setTimeout(() => {
      expect(component.imagePreviewUrl).toBe(
        "data:image/jpeg;base64,samplebase64data",
      );
      done();
    });
  });

  it("should handle file selection for image type and set profile picture", () => {
    const file = new File(["sample content"], "sample.jpg", {
      type: "image/jpeg",
    });
    const event = { target: { files: [file] } };

    const createFilePreviewSpy = jest.spyOn(component, "createFilePreview");
    const patchValueSpy = jest.spyOn(component.profileForm, "patchValue");

    component.onFileSelected(event, "image");

    expect(createFilePreviewSpy).toHaveBeenCalledWith(file);
    expect(component.profileUpload).toEqual({ file, name: file.name });
    expect(patchValueSpy).toHaveBeenCalledWith({ profilePicture: file });
  });

  it("should handle file selection for cv type and set CV", () => {
    const file = new File(["sample content"], "resume.pdf", {
      type: "application/pdf",
    });
    const event = { target: { files: [file] } };

    const patchValueSpy = jest.spyOn(component.profileForm, "patchValue");

    // Call the method with type 'cv'
    component.onFileSelected(event, "cv");

    expect(component.cvUpload).toEqual({ file, name: file.name });
    expect(component.cvFileName).toBe(file.name);
    expect(patchValueSpy).toHaveBeenCalledWith({ cv: file });
  });

  it("should toggle the dropdown state correctly", () => {
    // Initial state of dropdowns
    component.isDropdownOpen = { 0: false, 1: false, 2: false };

    // Toggle the dropdown at index 1
    component.toggleDropdown(1);

    // Only the dropdown at index 1 should be open
    expect(component.isDropdownOpen[0]).toBeFalsy();
    expect(component.isDropdownOpen[1]).toBeTruthy();
    expect(component.isDropdownOpen[2]).toBeFalsy();

    // Toggle the dropdown at index 1 again
    component.toggleDropdown(1);

    // All dropdowns should be closed
    expect(component.isDropdownOpen[0]).toBeFalsy();
    expect(component.isDropdownOpen[1]).toBeFalsy();
    expect(component.isDropdownOpen[2]).toBeFalsy();

    // Toggle the dropdown at index 2
    component.toggleDropdown(2);

    // Only the dropdown at index 2 should be open
    expect(component.isDropdownOpen[0]).toBeFalsy();
    expect(component.isDropdownOpen[1]).toBeFalsy();
    expect(component.isDropdownOpen[2]).toBeTruthy();
  });

  it("should select icon, close dropdown, and patch social media group", () => {
    component.selectedIcons = ["", "", ""];
    component.isDropdownOpen = { 0: true, 1: true, 2: true };

    const mockSocialMediaGroup = {
      patchValue: jest.fn(),
    } as unknown as FormGroup;

    jest
      .spyOn(component, "getSocialMediaGroup")
      .mockReturnValue(mockSocialMediaGroup);

    const iconName = "Twitter";
    const index = 1;
    component.selectIcon(iconName, index);

    expect(component.selectedIcons[index]).toBe(iconName);
    expect(component.isDropdownOpen[index]).toBeFalsy();

    expect(mockSocialMediaGroup.patchValue).toHaveBeenCalledWith({
      name: iconName,
    });
  });

  it("should remove a social media entry and update states correctly", () => {
    const mockFormArray = new FormArray([
      new FormControl({ name: "Facebook" }),
      new FormControl({ name: "Twitter" }),
    ]);
    mockFormArray.removeAt = jest.fn();

    jest
      .spyOn(component.profileForm, "get")
      .mockReturnValue(mockFormArray as any);

    component.selectedIcons = { 0: "Facebook", 1: "Twitter" };
    component.isDropdownOpen = { 0: true, 1: false };

    const reindexTrackingObjectsSpy = jest.spyOn(
      component,
      "reindexTrackingObjects",
    );

    component.removeSocialMedia(1);

    expect(mockFormArray.removeAt).toHaveBeenCalledWith(1);
    expect(component.selectedIcons[1]).toBeUndefined();
    expect(component.isDropdownOpen[1]).toBeUndefined();
    expect(reindexTrackingObjectsSpy).toHaveBeenCalled();
  });

  it("should reset the first social media entry if only one entry exists", () => {
    const mockFormArray = {
      length: 1,
      removeAt: jest.fn(),
      at: jest.fn().mockReturnValue({ reset: jest.fn() }),
    } as unknown as FormArray;

    jest
      .spyOn(component.profileForm, "get")
      .mockReturnValue(mockFormArray as any);

    component.selectedIcons = { 0: "Facebook" };
    component.isDropdownOpen = { 0: true };

    component.removeSocialMedia(0);

    expect(component.socialMedia.at(0).reset).toHaveBeenCalled();

    expect(component.selectedIcons[0]).toBe("");
  });

  it("should remove the image file and reset related fields", () => {
    // Initial setup
    component.profileUpload = {
      file: new File([], "sample.jpg"),
      name: "sample.jpg",
    };
    component.imagePreviewUrl = "data:image/jpeg;base64,samplebase64data";
    const patchValueSpy = jest.spyOn(component.profileForm, "patchValue");

    // Call the method with type 'image'
    component.removeFile("image");

    // Verify that the related fields are reset
    expect(component.profileUpload).toBeNull();
    expect(component.imagePreviewUrl).toBeNull();
    expect(patchValueSpy).toHaveBeenCalledWith({ profilePicture: null });
  });

  it("should remove the CV file and reset related fields", () => {
    component.cvUpload = {
      file: new File([], "resume.pdf"),
      name: "resume.pdf",
    };
    component.cvFileName = "resume.pdf";
    const patchValueSpy = jest.spyOn(component.profileForm, "patchValue");

    component.removeFile("cv");

    expect(component.cvUpload).toBeNull();
    expect(component.cvFileName).toBeNull();
    expect(patchValueSpy).toHaveBeenCalledWith({ cv: null });
  });

  it("should reindex tracking objects correctly", () => {
    // Mock the socialMedia FormArray
    const mockFormArray = {
      controls: [{}, {}], // Simulate two controls
    } as unknown as FormArray;

    // Spy on the get method of profileForm to return the mock FormArray for socialMedia
    jest
      .spyOn(component.profileForm, "get")
      .mockReturnValue(mockFormArray as any);

    component.selectedIcons = { 1: "Icon1", 2: "Icon2" };
    component.isDropdownOpen = { 1: true, 2: false };

    // Call the reindexTrackingObjects method
    component.reindexTrackingObjects();

    // Verify the newSelectedIcons and newIsDropdownOpen are reindexed correctly
    expect(component.selectedIcons).toEqual({ 0: "Icon1", 1: "Icon2" });
    expect(component.isDropdownOpen).toEqual({ 0: true, 1: false });
  });

  it("should handle case where selectedIcons or isDropdownOpen are undefined", () => {
    const mockFormArray = {
      controls: [{}, {}, {}],
    } as unknown as FormArray;

    jest
      .spyOn(component.profileForm, "get")
      .mockReturnValue(mockFormArray as any);

    component.selectedIcons = { 1: "Icon1" };
    component.isDropdownOpen = { 1: true };

    component.reindexTrackingObjects();

    expect(component.selectedIcons).toEqual({ 0: "Icon1" });
    expect(component.isDropdownOpen).toEqual({ 0: true });
  });

  it("should handle file drop event for image type and call onFileSelected", () => {
    const file = new File(["sample content"], "sample.jpg", {
      type: "image/jpeg",
    });

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files: [file] },
    } as unknown as DragEvent;

    const onFileSelectedSpy = jest.spyOn(component, "onFileSelected");

    component.handleDrop(mockEvent, "image");

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();

    expect(onFileSelectedSpy).toHaveBeenCalledWith(
      { target: { files: [file] } },
      "image",
    );
  });

  it("should handle file drop event for cv type and call onFileSelected", () => {
    const file = new File(["sample content"], "resume.pdf", {
      type: "application/pdf",
    });

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files: [file] },
    } as unknown as DragEvent;

    const onFileSelectedSpy = jest.spyOn(component, "onFileSelected");

    component.handleDrop(mockEvent, "cv");

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();

    expect(onFileSelectedSpy).toHaveBeenCalledWith(
      { target: { files: [file] } },
      "cv",
    );
  });
  it("should handle file selection for image type and set profile picture", () => {
    const file = new File(["sample content"], "sample.jpg", {
      type: "image/jpeg",
    });
    const event = { target: { files: [file] } };

    const createFilePreviewSpy = jest.spyOn(component, "createFilePreview");
    const patchValueSpy = jest.spyOn(component.profileForm, "patchValue");

    // Call the method with type 'image'
    component.onFileSelected(event, "image");

    expect(createFilePreviewSpy).toHaveBeenCalledWith(file);
    expect(component.profileUpload).toEqual({ file, name: file.name });
    expect(patchValueSpy).toHaveBeenCalledWith({ profilePicture: file });
  });

  it("should use the correct selector when type is 'image'", () => {
    // Create a mock HTMLInputElement with a spy on the click method
    const mockFileInput = document.createElement("input");
    mockFileInput.click = jest.fn();

    // Mock the querySelector method to return the mock input element
    const querySelectorSpy = jest
      .spyOn(document, "querySelector")
      .mockReturnValue(mockFileInput);

    // Call the method with type 'image'
    component.openFileSelector("image");

    // Verify that querySelector was called with the correct selector
    expect(querySelectorSpy).toHaveBeenCalledWith(".profile-upload input");

    // Verify that the click method was called on the mock input element
    expect(mockFileInput.click).toHaveBeenCalled();
  });

  it("should use the correct selector when type is 'cv'", () => {
    const mockFileInput = document.createElement("input");
    mockFileInput.click = jest.fn();

    const querySelectorSpy = jest
      .spyOn(document, "querySelector")
      .mockReturnValue(mockFileInput);

    component.openFileSelector("cv");

    expect(querySelectorSpy).toHaveBeenCalledWith(".cv-upload input");

    expect(mockFileInput.click).toHaveBeenCalled();
  });

  it("should not throw an error if the file input is not found", () => {
    jest.spyOn(document, "querySelector").mockReturnValue(null);

    expect(() => component.openFileSelector("image")).not.toThrow();

    expect(() => component.openFileSelector("cv")).not.toThrow();
  });
});
