import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TalentProfileService } from "./talent-profile.service";
import { PersonalDetails } from "../models/personal.detalis.interface";
import { environment } from "../../../../environments/environment.development";

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

  describe("getPersonalDetails", () => {
    it("should fetch personal details successfully", () => {
      const mockResponse = {
        status: "success",
        message: "Personal details fetched successfully",
        data: {
          firstName: "John",
          lastName: "Doe",
          introduction: "Test introduction",
          birthDate: "1990-01-01",
          nationality: "American",
          currentLocation: "New York",
          phoneNumber: "123-456-7890",
          phoneVisibility: "public",
          socialMedia: [],
          profilePicture: "",
          cvUrl: "",
          portfolios: [],
        },
      };

      service.getPersonalDetails().subscribe((details: PersonalDetails) => {
        expect(details).toEqual(mockResponse.data);
      });

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      expect(req.request.method).toBe("GET");

      req.flush(mockResponse);
    });

    it("should handle HTTP error response", () => {
      const errorMessage = "Error occurred while fetching personal details";

      service.getPersonalDetails().subscribe(
        () => fail("Expected an error, not personal details"),
        (error) => {
          expect(error).toBe(errorMessage);
        },
      );

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      expect(req.request.method).toBe("GET");

      req.flush(
        { error: errorMessage },
        { status: 500, statusText: "Internal Server Error" },
      );
    });

    it("should handle generic error if no error message is returned", () => {
      service.getPersonalDetails().subscribe(
        () => fail("Expected an error, not personal details"),
        (error) => {
          expect(error).toBeTruthy();
        },
      );

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      expect(req.request.method).toBe("GET");

      req.flush(null, { status: 500, statusText: "Internal Server Error" });
    });

    it("should log responses to the console", () => {
      const consoleSpy = jest.spyOn(console, "log");
      const mockResponse = {
        status: "success",
        message: "Fetched successfully",
        data: {},
      };

      service.getPersonalDetails().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      req.flush(mockResponse);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Response from backend:",
        mockResponse,
      );
    });
  });

  describe("patchPersonalDetails", () => {
    const mockUpdate = {
      firstName: "Jane",
      lastName: "Doe",
    };

    it("should patch personal details successfully", () => {
      const mockResponse = {
        status: "success",
        message: "Details updated",
        data: {
          ...mockUpdate,
          introduction: "Updated intro",
          birthDate: "2000-01-01",
          nationality: "Canadian",
          currentLocation: "Toronto",
          phoneNumber: "987-654-3210",
          phoneVisibility: "public",
          socialMedia: [],
          profilePicture: "",
          cvUrl: "",
          portfolios: [],
        },
      };

      service.patchPersonalDetails(mockUpdate).subscribe((details) => {
        expect(details).toEqual(mockResponse.data);
      });

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual(mockUpdate);

      req.flush(mockResponse);
    });

    it("should handle errors when patching personal details", () => {
      const errorMessage = "Error updating personal details";

      service.patchPersonalDetails(mockUpdate).subscribe(
        () => fail("Expected an error, not personal details"),
        (error) => {
          expect(error).toBe(errorMessage);
        },
      );

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      expect(req.request.method).toBe("PATCH");

      req.flush(
        { error: errorMessage },
        { status: 500, statusText: "Internal Server Error" },
      );
    });

    it("should handle generic error if no error message is returned", () => {
      service.patchPersonalDetails(mockUpdate).subscribe(
        () => fail("Expected an error, not personal details"),
        (error) => {
          expect(error).toBeTruthy();
        },
      );

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      expect(req.request.method).toBe("PATCH");

      req.flush(null, { status: 500, statusText: "Internal Server Error" });
    });

    it("should log responses to the console", () => {
      const consoleSpy = jest.spyOn(console, "log");
      const mockResponse = {
        status: "success",
        message: "Updated successfully",
        data: {},
      };

      service.patchPersonalDetails(mockUpdate).subscribe();
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`,
      );
      req.flush(mockResponse);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Response from backend:",
        mockResponse,
      );
    });
  });
});
