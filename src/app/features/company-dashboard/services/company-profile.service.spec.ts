import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CompanyProfileService } from "./company-profile.service";
import {
  CompanyUser,
  UpdateCompanyUser,
  CompanyUserResponse,
  ApiResponse,
} from "../models/company-user";
import { HttpErrorResponse } from "@angular/common/http";

describe("CompanyProfileService", () => {
  let service: CompanyProfileService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyProfileService],
    });

    service = TestBed.inject(CompanyProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get company user info", () => {
    const mockResponse: ApiResponse<CompanyUser> = {
      status: "success",
      message: "Company user fetched successfully",
      data: {
        name: "TechnoBrains",
        websiteUrl: "ifill-cleaning-solutoins.com",
        socialMedia: ["https://www.linkedin.com/in/furaha"],
        logoUrl: "https://example.com/logo.jpg",
        status: "CREATED",
        registrationDate: "2024-11-30",
        companyAdmin: 4,
        phoneNumber: "+250780163267",
      },
    };

    service.getCompanyUserInfo().subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(service["apiUrl"]);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should handle missing data in response when getting company user info", () => {
    const mockResponse: ApiResponse<CompanyUser> = {
      status: "success",
      message: "Company user fetched successfully",
      data: null as unknown as CompanyUser, // Simulate missing data
    };

    service.getCompanyUserInfo().subscribe({
      next: () => fail("expected an error, not data"),
      error: (error) => {
        expect(error.message).toContain("Invalid response format");
      },
    });

    const req = httpTestingController.expectOne(service["apiUrl"]);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should update company user info", () => {
    const updatedData: UpdateCompanyUser = {
      phoneNumber: "+250780132330",
      websiteUrl: "updated-website.com",
      socialMedia: ["https://updated-social-media.com"],
    };

    const mockResponse: ApiResponse<CompanyUserResponse> = {
      status: "success",
      message: "Company updated successfully",
      data: {
        id: "be549069-a7dd-464b-9094-5b3ecda208c1",
        name: "TechnoBrains",
        websiteUrl: "updated-website.com",
        socialMedia: ["https://updated-social-media.com"],
        logoUrl: "https://example.com/logo.jpg",
        status: "CREATED",
        registrationDate: "2024-11-30",
        companyAdmin: 4,
        phoneNumber: "+250780132330",
      },
    };

    service.updateCompanyUserInfo(updatedData).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(service["apiUrl"]);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(updatedData);
    req.flush(mockResponse);
  });

  it("should handle client-side error", () => {
    service.getCompanyUserInfo().subscribe({
      next: () => fail("expected an error, not data"),
      error: (error) => {
        expect(error.message).toContain("Error: Client-side error");
      },
    });

    const req = httpTestingController.expectOne(service["apiUrl"]);
    req.error(
      new ErrorEvent("Network error", { message: "Client-side error" }),
    );
  });

  it("should handle server-side error", () => {
    const mockError = new HttpErrorResponse({
      error: "Server-side error",
      status: 500,
      statusText: "Server Error",
    });

    service.updateCompanyUserInfo({ phoneNumber: "+250780132330" }).subscribe({
      next: () => fail("expected an error, not data"),
      error: (error) => {
        expect(error.message).toContain("Error Code: 500");
      },
    });

    const req = httpTestingController.expectOne(service["apiUrl"]);
    req.flush("Server-side error", mockError);
  });
});
