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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TalentProfileService],
    });

    service = TestBed.inject(TalentProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get personal details", () => {
    const mockResponse: ApiResponse<PersonalDetails> = {
      status: "success",
      message: "Personal details fetched successfully",
      data: {
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
        portfolios: [
          "http://example.com/portfolio1",
          "http://example.com/portfolio2",
        ],
      },
    };

    service.getPersonalDetails().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      service["personalDetailsEndpoint"],
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });
  it("should get personal details from API if not available in cache", () => {
    localStorage.removeItem(service["PERSONAL_DETAILS_KEY"]);

    const mockResponse: ApiResponse<PersonalDetails> = {
      status: "success",
      message: "Personal details fetched successfully",
      data: {
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
        portfolios: [
          "http://example.com/portfolio1",
          "http://example.com/portfolio2",
        ],
      },
    };

    service.getPersonalDetails().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      service["personalDetailsEndpoint"],
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);

    service.getPersonalDetails().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    httpTestingController.expectNone(service["personalDetailsEndpoint"]);

    const cachedData = localStorage.getItem(service["PERSONAL_DETAILS_KEY"]);
    expect(cachedData).toBeTruthy();
    expect(JSON.parse(cachedData!)).toEqual(mockResponse);
  });

  it("should update personal details", () => {
    const updatedDetails: PersonalDetails = {
      firstName: "Jane",
      lastName: "Doe",
      introduction: "Hello, I am Jane Doe.",
      birthDate: "1992-02-02",
      nationality: "Canadian",
      currentLocation: "Toronto, Canada",
      phoneNumber: "+987654321",
      phoneVisibility: "private",
      socialMedia: [{ name: "LinkedIn", url: "http://linkedin.com/janedoe" }],
      profilePictureUrl: "http://example.com/profile2.jpg",
      cvUrl: "http://example.com/cv2.pdf",
      portfolios: [
        "http://example.com/portfolio3",
        "http://example.com/portfolio4",
      ],
    };

    const mockResponse: ApiResponse<PersonalDetails> = {
      status: "success",
      message: "Personal details updated successfully",
      data: updatedDetails,
    };

    service.updatePersonalDetails(updatedDetails).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });

  it("should get schools", () => {
    const mockResponse: ApiResponse<EducationRecord[]> = {
      status: "success",
      message: "Schools fetched successfully",
      data: [
        {
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
        },
      ],
    };

    service.getSchools().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(service["schoolsEndpoint"]);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should create school", () => {
    const newSchool: EducationRecord = {
      id: "2",
      name: "MIT",
      address: "Cambridge, MA",
      country: "USA",
      qualificationLevel: "Master's",
      programName: "Electrical Engineering",
      programStatus: "Ongoing",
      commencementDate: "2020-09-01",
      completionDate: "",
      academicTranscriptUrls: ["http://example.com/transcript2"],
    };

    const mockResponse: ApiResponse<EducationRecord> = {
      status: "success",
      message: "School created successfully",
      data: newSchool,
    };

    service.createSchools(newSchool).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      service["createSchoolsEndpoint"],
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(newSchool);
    req.flush(mockResponse);
  });

  it("should update local storage", () => {
    const updatedRecord: EducationRecord = {
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

    const mockRecords = JSON.stringify([updatedRecord]);
    localStorage.setItem(service["STORAGE_KEY"], mockRecords);

    service.updateLocalStorage("1", updatedRecord);

    const updatedRecords = JSON.parse(
      localStorage.getItem(service["STORAGE_KEY"]) || "[]",
    );
    expect(updatedRecords).toEqual([updatedRecord]);
  });

  it("should delete school from local storage", () => {
    const record: EducationRecord = {
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

    const mockRecords = JSON.stringify([record]);
    localStorage.setItem(service["STORAGE_KEY"], mockRecords);

    service.deleteSchool("1").subscribe((response) => {
      expect(response.status).toBe("success");
    });

    const updatedRecords = JSON.parse(
      localStorage.getItem(service["STORAGE_KEY"]) || "[]",
    );
    expect(updatedRecords).toEqual([]);
  });

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

    const req = httpTestingController.expectOne(service["userInfoEndpoint"]);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });
  describe("Error Handling", () => {
    it("should retry once before throwing error", () => {
      localStorage.removeItem(service["PERSONAL_DETAILS_KEY"]);

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

      const firstReq = httpTestingController.expectOne(
        service["personalDetailsEndpoint"],
      );
      firstReq.flush("500 error", {
        status: serverError.status,
        statusText: serverError.message,
      });

      const retryReq = httpTestingController.expectOne(
        service["personalDetailsEndpoint"],
      );
      retryReq.flush("500 error", {
        status: serverError.status,
        statusText: serverError.message,
      });

      // Verify no more retries
      httpTestingController.expectNone(service["personalDetailsEndpoint"]);
    });
  });
});
