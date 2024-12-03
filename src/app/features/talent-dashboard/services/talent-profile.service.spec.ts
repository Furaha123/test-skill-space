import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TalentProfileService } from "./talent-profile.service";
import {
  PersonalDetails,
  ApiResponse,
} from "../models/personal.detalis.interface";
import { EducationRecord } from "../models/education.record.interface";

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
      status: "Success",
      message: "Got personal Details Successfully",
      data: {
        firstName: "Moses",
        lastName: "Doe",
        introduction:
          "A passionate software developer with over 10 years of experience in full-stack development.",
        birthDate: "1990-05-15",
        nationality: "American",
        currentLocation: "San Francisco, CA, USA",
        phoneNumber: "+1-555-123-4567",
        phoneVisibility: "public",
        socialMedia: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/johndoe" },
          { name: "GitHub", url: "https://github.com/johndoe" },
          { name: "Twitter", url: "https://twitter.com/johndoe" },
        ],
        profilePictureUrl: "https://example.com/profile-picture.jpg",
        cvUrl: "https://example.com/cv/johndoe.pdf",
        portfolios: [
          "https://portfolio.johndoe.com",
          "https://behance.net/johndoe",
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

  it("should get schools", () => {
    const mockRecords: EducationRecord[] = [
      {
        id: "1",
        name: "Harvard University",
        address: "Massachusetts, USA",
        country: "USA",
        qualificationLevel: "Bachelor's",
        programName: "Computer Science",
        programStatus: "Completed",
        commencementDate: "2005-09-01",
        completionDate: "2009-06-30",
        academicTranscriptUrls: "http://example.com/transcript1",
      },
    ];

    const mockResponse: ApiResponse<EducationRecord[]> = {
      status: "success",
      message: "Fetched education records successfully",
      data: mockRecords,
    };

    service.getSchools().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(service["schoolsEndpoint"]);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should create a school", () => {
    const newSchool: EducationRecord = {
      id: "2",
      name: "MIT",
      address: "Massachusetts, USA",
      country: "USA",
      qualificationLevel: "Master's",
      programName: "Software Engineering",
      programStatus: "Ongoing",
      commencementDate: "2020-09-01",
      completionDate: "2022-06-30",
      academicTranscriptUrls: "http://example.com/transcript2",
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

  it("should update a school", () => {
    const updatedSchool: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Massachusetts, USA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2005-09-01",
      completionDate: "2009-06-30",
      academicTranscriptUrls: "http://example.com/transcript1",
    };

    const mockResponse: ApiResponse<EducationRecord> = {
      status: "success",
      message: "School updated successfully",
      data: updatedSchool,
    };

    service
      .updateSchool(updatedSchool.id, updatedSchool)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne(
      `${service["createSchoolsEndpoint"]}/${updatedSchool.id}`,
    );
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(updatedSchool);
    req.flush(mockResponse);
  });
});
