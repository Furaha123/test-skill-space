import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TalentProfileService } from "./talent-profile.service";
import {
  ApiResponse,
  PersonalDetails,
  UserInfo,
} from "../models/personal.detalis.interface";
import { EducationRecord } from "../models/education.record.interface";
import { HttpError } from "../models/http-error.interface";

describe("TalentProfileService", () => {
  let service: TalentProfileService;
  let httpTestingController: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TalentProfileService],
    });

    service = TestBed.inject(TalentProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Personal Details", () => {
    it("should get personal details from API", () => {
      const mockResponse: ApiResponse<PersonalDetails> = {
        status: "success",
        message: "Personal details fetched successfully",
        data: mockPersonalDetails,
      };

      service.getPersonalDetails().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        "api/v1/talent/personal-details",
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should update personal details", () => {
      const updatedDetails: PersonalDetails = {
        ...mockPersonalDetails,
        firstName: "Jane",
        lastName: "Smith",
      };

      const mockResponse: ApiResponse<PersonalDetails> = {
        status: "success",
        message: "Personal details updated successfully",
        data: updatedDetails,
      };

      service.updatePersonalDetails(updatedDetails).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        "api/v1/talent/personal-details",
      );
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(updatedDetails);
      req.flush(mockResponse);
    });
  });

  describe("Education Records", () => {
    const mockEducationRecord: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Cambridge, MA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2015-09-01",
      completionDate: "2019-05-15",
      academicTranscriptUrls: ["http://example.com/transcript1"],
    };

    it("should get schools", () => {
      const mockResponse: ApiResponse<EducationRecord[]> = {
        status: "success",
        message: "Schools fetched successfully",
        data: [mockEducationRecord],
      };

      service.getSchools().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne("/api/v1/talent/schools");
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should create school", () => {
      const mockResponse: ApiResponse<EducationRecord> = {
        status: "success",
        message: "School created successfully",
        data: mockEducationRecord,
      };

      service.createSchools(mockEducationRecord).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne("/api/v1/talent/schools");
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(mockEducationRecord);
      req.flush(mockResponse);
    });

    it("should update local storage", () => {
      const updatedRecord = { ...mockEducationRecord, name: "MIT" };

      localStorage.setItem(
        service["STORAGE_KEY"],
        JSON.stringify([mockEducationRecord]),
      );

      service.updateLocalStorage("1", updatedRecord);

      const storedData = JSON.parse(
        localStorage.getItem(service["STORAGE_KEY"]) || "[]",
      );
      expect(storedData).toEqual([updatedRecord]);
    });

    it("should delete school from local storage", () => {
      localStorage.setItem(
        service["STORAGE_KEY"],
        JSON.stringify([mockEducationRecord]),
      );

      service.deleteSchool("1").subscribe((response) => {
        expect(response.status).toBe("success");
        expect(response.message).toBe("School deleted successfully");
      });

      const storedData = JSON.parse(
        localStorage.getItem(service["STORAGE_KEY"]) || "[]",
      );
      expect(storedData).toEqual([]);
    });
  });

  describe("User Info", () => {
    it("should get user info", () => {
      const mockResponse: ApiResponse<UserInfo> = {
        status: "success",
        message: "User info fetched successfully",
        data: {
          id: 1,
          email: "user@example.com",
        },
      };

      service.getUserInfo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne("api/v1/auth/get-user-info");
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });
  });

  describe("Error Handling", () => {
    it("should retry once and then handle error", () => {
      const serverError: HttpError = {
        error: null,
        status: 500,
        message: "Internal Server Error",
      };

      service.getPersonalDetails().subscribe({
        error: (error) => {
          expect(error.message).toBe(
            `Error Code: ${serverError.status}\nMessage: ${serverError.message}`,
          );
        },
      });

      // First attempt
      const firstReq = httpTestingController.expectOne(
        "api/v1/talent/personal-details",
      );
      firstReq.error(new ErrorEvent("Network error"), {
        status: serverError.status,
        statusText: serverError.message,
      });

      // Retry attempt
      const retryReq = httpTestingController.expectOne(
        "api/v1/talent/personal-details",
      );
      retryReq.error(new ErrorEvent("Network error"), {
        status: serverError.status,
        statusText: serverError.message,
      });
    });
  });
});
