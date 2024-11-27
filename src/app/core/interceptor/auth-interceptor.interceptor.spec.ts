import { TestBed } from "@angular/core/testing";
import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { AuthInterceptor } from "../interceptor/auth-interceptor.interceptor";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";

describe("AuthInterceptor", () => {
  let interceptor: AuthInterceptor;
  let mockToastr: jest.Mocked<ToastrService>;
  let mockHandler: jest.Mocked<HttpHandler>;

  beforeEach(() => {
    mockToastr = {
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    mockHandler = {
      handle: jest.fn(),
    } as unknown as jest.Mocked<HttpHandler>;

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: ToastrService, useValue: mockToastr },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });

  describe("intercept", () => {
    it("should add auth token to headers if token exists", (done) => {
      const token = "test-token";
      sessionStorage.setItem("authToken", token);
      const request = new HttpRequest<unknown>("GET", "test-url");

      mockHandler.handle.mockReturnValue(of(new HttpResponse()));

      interceptor.intercept(request, mockHandler).subscribe(() => {
        const modifiedRequest = mockHandler.handle.mock
          .calls[0][0] as HttpRequest<unknown>;
        expect(modifiedRequest.headers.get("Authorization")).toBe(
          `Bearer ${token}`,
        );
        done();
      });
    });

    it("should not modify headers if no token exists", (done) => {
      const request = new HttpRequest<unknown>("GET", "test-url");
      mockHandler.handle.mockReturnValue(of(new HttpResponse()));

      interceptor.intercept(request, mockHandler).subscribe(() => {
        expect(mockHandler.handle).toHaveBeenCalledWith(request);
        done();
      });
    });
  });

  describe("error handling", () => {
    const request = new HttpRequest<unknown>("GET", "test-url");

    it("should handle client-side error", (done) => {
      const errorEvent = new ErrorEvent("Network error", {
        message: "Test client error",
      });
      const errorResponse = new HttpErrorResponse({
        error: errorEvent,
      });

      mockHandler.handle.mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, mockHandler).subscribe({
        error: (error) => {
          expect(mockToastr.error).toHaveBeenCalledWith(
            "Test client error",
            "Error",
          );
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });

    it("should handle server-side error with object response", (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { message: "Test server error" },
        status: 500,
      });

      mockHandler.handle.mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, mockHandler).subscribe({
        error: (error) => {
          expect(mockToastr.error).toHaveBeenCalledWith(
            "Test server error",
            "Error",
          );
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });

    describe("password reset errors", () => {
      [
        { status: 400, title: "Password Error" },
        { status: 401, title: "Invalid Request" },
        { status: 404, title: "Reset Link Error" },
        { status: 500, title: "Password Reset Error" },
      ].forEach(({ status, title }) => {
        it(`should handle password reset ${status} error`, (done) => {
          const resetRequest = new HttpRequest<unknown>(
            "POST",
            "/auth/reset-password",
            null,
            {
              headers: new HttpHeaders(),
              reportProgress: false,
            },
          );
          const errorResponse = new HttpErrorResponse({
            error: { message: "Reset password error" },
            status,
            url: "/auth/reset-password",
          });

          mockHandler.handle.mockReturnValue(throwError(() => errorResponse));

          interceptor.intercept(resetRequest, mockHandler).subscribe({
            error: (error) => {
              expect(mockToastr.error).toHaveBeenCalledWith(
                "Reset password error",
                title,
              );
              expect(error).toBe(errorResponse);
              done();
            },
          });
        });
      });
    });

    it("should handle server error with non-object error response", (done) => {
      const errorResponse = new HttpErrorResponse({
        error: "String error",
        status: 500,
        statusText: "Error",
      });

      mockHandler.handle.mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, mockHandler).subscribe({
        error: (error) => {
          expect(mockToastr.error).toHaveBeenCalledWith(
            errorResponse.message,
            "Error",
          );
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });

    it("should handle error with null error object", (done) => {
      const errorResponse = new HttpErrorResponse({
        error: null,
        status: 500,
      });

      mockHandler.handle.mockReturnValue(throwError(() => errorResponse));

      interceptor.intercept(request, mockHandler).subscribe({
        error: (error) => {
          expect(mockToastr.error).toHaveBeenCalledWith(
            errorResponse.message,
            "Error",
          );
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });
});
