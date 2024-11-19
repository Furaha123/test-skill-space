import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CompanyProfileService } from "./company-profile.service";
import { CompanyUser } from "../models/company-user";

describe("CompanyProfileService", () => {
  let service: CompanyProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyProfileService],
    });

    service = TestBed.inject(CompanyProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch company user info", () => {
    const mockResponse: CompanyUser = {
      id: "123",
      name: "Test Company",
      contact: {
        phone: "+1-123-4567",
        website: "http://test.com",
        email: "test@test.com",
      },
      logo: "logo.png",
      documentUrl: "document.pdf",
      password: "password123",
    };

    service.getCompanyUserInfo().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service["apiUrl"]);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should update company user info successfully", () => {
    const mockInitialData: CompanyUser = {
      id: "123",
      name: "Initial Company",
      contact: {
        phone: "+1-123-4567",
        website: "http://initial.com",
        email: "initial@test.com",
      },
      logo: "initial.png",
      documentUrl: "initial.pdf",
      password: "password123",
    };

    const updatedData: Partial<CompanyUser> = {
      name: "Updated Company",
      contact: {
        phone: "+1-999-9999",
        website: "http://initial.com",
        email: "initial@test.com",
      },
    };

    localStorage.setItem("companyUser", JSON.stringify(mockInitialData));

    service.updateCompanyUserInfo(updatedData).subscribe((result) => {
      expect(result).toBe(true);
      const updatedUser = JSON.parse(localStorage.getItem("companyUser") ?? "");
      expect(updatedUser.name).toBe("Updated Company");
      expect(updatedUser.contact.phone).toBe("+1-999-9999");
      expect(updatedUser.contact.website).toBe("http://initial.com");
      expect(updatedUser.contact.email).toBe("initial@test.com");
    });
  });

  it("should handle update error if no existing data in local storage", () => {
    localStorage.removeItem("companyUser");

    service.updateCompanyUserInfo({ name: "New Data" }).subscribe({
      next: () => fail("Expected an error but got a success response"),
      error: (error) => {
        expect(error.message).toBe(
          "No company user data found in local storage to update.",
        );
      },
    });
  });

  it("should handle JSON parse error gracefully during update", () => {
    localStorage.setItem("companyUser", "Invalid JSON Data");

    service.updateCompanyUserInfo({ name: "New Data" }).subscribe({
      next: () => fail("Expected an error but got a success response"),
      error: (error) => {
        expect(error.message).toBe("Failed to update company user info.");
      },
    });
  });

  it("should handle error during fetchCompanyUserInfo gracefully", () => {
    service.getCompanyUserInfo().subscribe({
      next: () => fail("Expected an error but got a success response"),
      error: (error) => {
        expect(error.message).toBe("Failed to fetch company user info.");
      },
    });

    const req = httpMock.expectOne(service["apiUrl"]);
    req.flush("Error fetching data", {
      status: 500,
      statusText: "Server Error",
    });
  });
});
