import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TalentProfileService } from "./talent-profile.service";
import { PersonalDetails } from "../models/personal.detalis.interface";

describe("TalentProfileService", () => {
  let service: TalentProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TalentProfileService],
    });

    service = TestBed.inject(TalentProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch personal details successfully", () => {
    const mockResponse = {
      status: "Success",
      message: "Got personal Details Successfully",
      data: {
        firstName: "John",
        lastName: "Doe",
        introduction: "Hello, I'm John Doe.",
        birthDate: "1990-01-01",
        nationality: "American",
        currentLocation: "New York",
        phoneNumber: "123-456-7890",
        phoneVisibility: true,
        socialMedia: [],
        profilePictureUrl: null,
        cvUrl: null,
        portfolios: [],
      } as PersonalDetails,
    };

    service.getPersonalDetails().subscribe((details) => {
      expect(details).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(
      `${service.apiUrl}/talent/talentId/personal-details`,
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.get("ngrok-skip-browser-warning")).toBe("true");

    req.flush(mockResponse);
  });

  it("should handle error when fetching personal details", () => {
    const errorMessage = "simulated network error";

    service.getPersonalDetails().subscribe({
      next: () => fail("expected an error, not personal details"),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(
      `${service.apiUrl}/talent/talentId/personal-details`,
    );

    req.flush(errorMessage, { status: 500, statusText: "Server Error" });
  });
});
