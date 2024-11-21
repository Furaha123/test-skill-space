import { TestBed } from "@angular/core/testing";
import { GoogleAuthService } from "./google-auth.service";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient, withFetch, HttpClient } from "@angular/common/http";
import { AuthResponse } from "../models/auth-response.model";
import { Observable, of } from "rxjs";

describe("GoogleAuthService", () => {
  let service: GoogleAuthService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const baseUrl =
    "https://59cf-102-22-146-226.ngrok-free.app/api/v1/auth/register/google";

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleAuthService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(GoogleAuthService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("postRegistration", () => {
    // Test using HttpClient spy
    it("should directly return the http.post call result", () => {
      const mockToken = "test-token";
      const mockEmail = "test@example.com";
      const mockResponse: AuthResponse = {
        data: {
          email: mockEmail,
          roles: ["USER"],
          token: "jwt-token",
        },
        message: "Success",
        status: "success",
      };

      // Create a spy that returns an observable
      const postSpy = jest
        .spyOn(httpClient, "post")
        .mockReturnValue(of(mockResponse));

      // Call the method
      const result = service.postRegistration(mockToken, mockEmail);

      // Verify the post method was called with correct parameters
      expect(postSpy).toHaveBeenCalledWith(baseUrl, {
        token: mockToken,
        email: mockEmail,
      });

      // Verify that the return value is the same observable
      result.subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      // Clean up
      postSpy.mockRestore();
    });

    // Test using HttpTestingController
    it("should return Observable<AuthResponse>", (done) => {
      const mockToken = "test-token";
      const mockEmail = "test@example.com";
      const mockResponse: AuthResponse = {
        data: {
          email: mockEmail,
          roles: ["USER"],
          token: "jwt-token",
        },
        message: "Success",
        status: "success",
      };

      const result = service.postRegistration(mockToken, mockEmail);

      // Verify it's an Observable
      expect(result instanceof Observable).toBeTruthy();
      expect(result.subscribe).toBeDefined();

      result.subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");
      req.flush(mockResponse);
    });

    // Rest of your existing tests...
    it("should send POST request with token and email", (done) => {
      const mockToken = "mock-token-123";
      const mockEmail = "test@example.com";
      const mockResponse: AuthResponse = {
        data: {
          email: "test@example.com",
          roles: ["USER"],
          token: "jwt-token-123",
        },
        message: "Registration successful",
        status: "success",
      };

      service.postRegistration(mockToken, mockEmail).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail,
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ token: mockToken, email: mockEmail });
      req.flush(mockResponse);
    });

    it("should handle error response", (done) => {
      const mockToken = "invalid-token";
      const mockEmail = "test@example.com";
      const mockErrorResponse = {
        status: 400,
        statusText: "Bad Request",
        error: { message: "Invalid token" },
      };

      service.postRegistration(mockToken, mockEmail).subscribe({
        next: () => {
          done.fail("should have failed with an error");
        },
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe("Invalid token");
          done();
        },
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");
      req.flush(mockErrorResponse.error, mockErrorResponse);
    });

    it("should send request to correct URL", (done) => {
      const mockToken = "mock-token-123";
      const mockEmail = "test@example.com";

      service.postRegistration(mockToken, mockEmail).subscribe({
        next: () => done(),
        error: done.fail,
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.url).toBe(baseUrl);
      req.flush({});
    });
  });
});
